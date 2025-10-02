import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import './AssignmentScheduler.css';

const AssignmentScheduler = ({ assignments, courses, userId, onStudyTimeScheduled }) => {
    const [studySessions, setStudySessions] = useState([]);
    const [schedulingSettings, setSchedulingSettings] = useState({
        studySessionLength: 2, // hours
        breakLength: 0.5, // hours
        maxSessionsPerDay: 4,
        preferredStudyTimes: {
            morning: { start: 9, end: 12 },
            afternoon: { start: 14, end: 17 },
            evening: { start: 19, end: 22 }
        },
        avoidWeekends: false,
        bufferDays: 1 // days before due date to finish
    });
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        loadStudySessions();
    }, [userId]);

    const loadStudySessions = async () => {
        if (!userId) return;
        
        try {
            const sessionsQuery = query(
                collection(db, 'studySessions'),
                where('userId', '==', userId)
            );
            const sessionsSnapshot = await getDocs(sessionsQuery);
            const userSessions = sessionsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setStudySessions(userSessions);
        } catch (error) {
            console.error('Error loading study sessions:', error);
        }
    };

    const generateStudySchedule = async () => {
        setIsGenerating(true);
        
        try {
            // Clear existing study sessions for this user
            const existingSessions = studySessions.filter(session => session.userId === userId);
            for (const session of existingSessions) {
                await deleteDoc(doc(db, 'studySessions', session.id));
            }

            const newSessions = [];
            const pendingAssignments = assignments.filter(assignment => !assignment.completed);
            
            for (const assignment of pendingAssignments) {
                const sessions = createStudySessionsForAssignment(assignment);
                newSessions.push(...sessions);
            }

            // Save all study sessions to Firestore
            for (const session of newSessions) {
                const docRef = await addDoc(collection(db, 'studySessions'), {
                    ...session,
                    userId: userId,
                    createdAt: new Date()
                });
                newSessions[newSessions.indexOf(session)].id = docRef.id;
            }

            setStudySessions(newSessions);
            onStudyTimeScheduled?.(newSessions);
        } catch (error) {
            console.error('Error generating study schedule:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const createStudySessionsForAssignment = (assignment) => {
        const sessions = [];
        const dueDate = new Date(assignment.dueDate);
        const startDate = new Date();
        const totalHours = assignment.estimatedHours || 2;
        const sessionLength = schedulingSettings.studySessionLength;
        const breakLength = schedulingSettings.breakLength;
        const bufferDays = schedulingSettings.bufferDays;
        
        // Calculate when to finish (due date minus buffer days)
        const finishDate = new Date(dueDate);
        finishDate.setDate(finishDate.getDate() - bufferDays);
        
        // Calculate total sessions needed
        const totalSessions = Math.ceil(totalHours / sessionLength);
        const daysAvailable = Math.max(1, Math.ceil((finishDate - startDate) / (1000 * 60 * 60 * 24)));
        const sessionsPerDay = Math.min(
            Math.ceil(totalSessions / daysAvailable),
            schedulingSettings.maxSessionsPerDay
        );

        let sessionCount = 0;
        let currentDate = new Date(startDate);

        while (sessionCount < totalSessions && currentDate <= finishDate) {
            // Skip weekends if setting is enabled
            if (schedulingSettings.avoidWeekends && (currentDate.getDay() === 0 || currentDate.getDay() === 6)) {
                currentDate.setDate(currentDate.getDate() + 1);
                continue;
            }

            // Find available time slots for this day
            const timeSlots = findAvailableTimeSlots(currentDate, sessionsPerDay);
            
            for (const timeSlot of timeSlots) {
                if (sessionCount >= totalSessions) break;

                const session = {
                    assignmentId: assignment.id,
                    assignmentTitle: assignment.title,
                    course: assignment.course,
                    startTime: timeSlot.start,
                    endTime: timeSlot.end,
                    duration: sessionLength,
                    priority: assignment.priority,
                    completed: false,
                    type: 'study'
                };

                sessions.push(session);
                sessionCount++;
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return sessions;
    };

    const findAvailableTimeSlots = (date, maxSessions) => {
        const slots = [];
        const preferredTimes = schedulingSettings.preferredStudyTimes;
        const sessionLength = schedulingSettings.studySessionLength;
        const breakLength = schedulingSettings.breakLength;

        // Check each preferred time period
        for (const [period, timeRange] of Object.entries(preferredTimes)) {
            if (slots.length >= maxSessions) break;

            const startHour = timeRange.start;
            const endHour = timeRange.end;
            
            // Create time slots within this period
            for (let hour = startHour; hour + sessionLength <= endHour && slots.length < maxSessions; hour += sessionLength + breakLength) {
                const startTime = new Date(date);
                startTime.setHours(hour, 0, 0, 0);
                
                const endTime = new Date(startTime);
                endTime.setHours(startTime.getHours() + sessionLength);

                // Check if this slot conflicts with existing sessions
                const conflicts = studySessions.some(session => {
                    const sessionStart = new Date(session.startTime);
                    const sessionEnd = new Date(session.endTime);
                    return (startTime < sessionEnd && endTime > sessionStart);
                });

                if (!conflicts) {
                    slots.push({
                        start: startTime,
                        end: endTime
                    });
                }
            }
        }

        return slots;
    };

    const getUpcomingSessions = () => {
        const now = new Date();
        return studySessions
            .filter(session => new Date(session.startTime) >= now)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            .slice(0, 5);
    };

    const getTodaysSessions = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return studySessions.filter(session => {
            const sessionDate = new Date(session.startTime);
            return sessionDate >= today && sessionDate < tomorrow;
        }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    };

    const handleSettingsChange = (key, value) => {
        setSchedulingSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleTimeRangeChange = (period, field, value) => {
        setSchedulingSettings(prev => ({
            ...prev,
            preferredStudyTimes: {
                ...prev.preferredStudyTimes,
                [period]: {
                    ...prev.preferredStudyTimes[period],
                    [field]: parseInt(value)
                }
            }
        }));
    };

    return (
        <div className="assignment-scheduler">
            <div className="scheduler-header">
                <h2>Assignment Scheduler</h2>
                <p>Automatically schedule study time for your assignments based on due dates and your preferences</p>
            </div>

            <div className="scheduler-content">
                <div className="scheduler-settings">
                    <h3>Study Preferences</h3>
                    <div className="settings-grid">
                        <div className="setting-group">
                            <label>Study Session Length (hours)</label>
                            <input
                                type="number"
                                min="0.5"
                                max="4"
                                step="0.5"
                                value={schedulingSettings.studySessionLength}
                                onChange={(e) => handleSettingsChange('studySessionLength', parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="setting-group">
                            <label>Break Length (hours)</label>
                            <input
                                type="number"
                                min="0"
                                max="2"
                                step="0.25"
                                value={schedulingSettings.breakLength}
                                onChange={(e) => handleSettingsChange('breakLength', parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="setting-group">
                            <label>Max Sessions Per Day</label>
                            <input
                                type="number"
                                min="1"
                                max="8"
                                value={schedulingSettings.maxSessionsPerDay}
                                onChange={(e) => handleSettingsChange('maxSessionsPerDay', parseInt(e.target.value))}
                            />
                        </div>

                        <div className="setting-group">
                            <label>Buffer Days Before Due</label>
                            <input
                                type="number"
                                min="0"
                                max="7"
                                value={schedulingSettings.bufferDays}
                                onChange={(e) => handleSettingsChange('bufferDays', parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="time-preferences">
                        <h4>Preferred Study Times</h4>
                        <div className="time-ranges">
                            {Object.entries(schedulingSettings.preferredStudyTimes).map(([period, timeRange]) => (
                                <div key={period} className="time-range">
                                    <label>{period.charAt(0).toUpperCase() + period.slice(1)}</label>
                                    <div className="time-inputs">
                                        <input
                                            type="number"
                                            min="0"
                                            max="23"
                                            value={timeRange.start}
                                            onChange={(e) => handleTimeRangeChange(period, 'start', e.target.value)}
                                        />
                                        <span>to</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="23"
                                            value={timeRange.end}
                                            onChange={(e) => handleTimeRangeChange(period, 'end', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="additional-settings">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={schedulingSettings.avoidWeekends}
                                onChange={(e) => handleSettingsChange('avoidWeekends', e.target.checked)}
                            />
                            Avoid weekends
                        </label>
                    </div>

                    <button 
                        className="generate-schedule-btn"
                        onClick={generateStudySchedule}
                        disabled={isGenerating || assignments.filter(a => !a.completed).length === 0}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Study Schedule'}
                    </button>
                </div>

                <div className="scheduler-results">
                    <div className="todays-sessions">
                        <h3>Today's Study Sessions</h3>
                        {getTodaysSessions().length === 0 ? (
                            <p className="no-sessions">No study sessions scheduled for today</p>
                        ) : (
                            <div className="sessions-list">
                                {getTodaysSessions().map((session, index) => (
                                    <div key={index} className="session-item">
                                        <div className="session-time">
                                            {new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                            {new Date(session.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <div className="session-details">
                                            <div className="session-title">{session.assignmentTitle}</div>
                                            <div className="session-course">{session.course}</div>
                                        </div>
                                        <div className={`session-priority ${session.priority}`}>
                                            {session.priority}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="upcoming-sessions">
                        <h3>Upcoming Sessions</h3>
                        {getUpcomingSessions().length === 0 ? (
                            <p className="no-sessions">No upcoming study sessions</p>
                        ) : (
                            <div className="sessions-list">
                                {getUpcomingSessions().map((session, index) => (
                                    <div key={index} className="session-item">
                                        <div className="session-date">
                                            {new Date(session.startTime).toLocaleDateString()}
                                        </div>
                                        <div className="session-time">
                                            {new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                            {new Date(session.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <div className="session-details">
                                            <div className="session-title">{session.assignmentTitle}</div>
                                            <div className="session-course">{session.course}</div>
                                        </div>
                                        <div className={`session-priority ${session.priority}`}>
                                            {session.priority}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentScheduler;

