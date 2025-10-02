import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Calendar from '../Calendar/Calendar';
import AssignmentList from '../AssignmentList/AssignmentList';
import CanvasIntegration from '../CanvasIntegration/CanvasIntegration';
import AssignmentScheduler from '../AssignmentScheduler/AssignmentScheduler';
import Settings from '../Settings/Settings';
import DayWeaveLogo from '../components/DayWeaveLogo';

const Dashboard = () => {
    const [user, loading, error] = useAuthState(auth);
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [scheduledEvents, setScheduledEvents] = useState([]);
    const [view, setView] = useState('calendar'); // 'calendar', 'assignments', 'scheduler', 'canvas', 'settings'
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        loadUserData();
    }, [user, loading, navigate]);

    const loadUserData = async () => {
        if (!user) return;
        
        try {
            // Load assignments
            const assignmentsQuery = query(
                collection(db, 'assignments'),
                where('userId', '==', user.uid)
            );
            const assignmentsSnapshot = await getDocs(assignmentsQuery);
            const userAssignments = assignmentsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAssignments(userAssignments);

            // Load courses
            const coursesQuery = query(
                collection(db, 'courses'),
                where('userId', '==', user.uid)
            );
            const coursesSnapshot = await getDocs(coursesQuery);
            const userCourses = coursesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCourses(userCourses);

            // Load scheduled events
            const eventsQuery = query(
                collection(db, 'scheduledEvents'),
                where('userId', '==', user.uid)
            );
            const eventsSnapshot = await getDocs(eventsQuery);
            const userEvents = eventsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setScheduledEvents(userEvents);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const addAssignment = async (assignment) => {
        try {
            const docRef = await addDoc(collection(db, 'assignments'), {
                ...assignment,
                userId: user.uid,
                createdAt: new Date(),
                completed: false
            });
            setAssignments([...assignments, { id: docRef.id, ...assignment }]);
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };

    const updateAssignment = async (assignmentId, updates) => {
        try {
            await updateDoc(doc(db, 'assignments', assignmentId), updates);
            setAssignments(assignments.map(assignment => 
                assignment.id === assignmentId 
                    ? { ...assignment, ...updates }
                    : assignment
            ));
        } catch (error) {
            console.error('Error updating assignment:', error);
        }
    };

    const deleteAssignment = async (assignmentId) => {
        try {
            await deleteDoc(doc(db, 'assignments', assignmentId));
            setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
        } catch (error) {
            console.error('Error deleting assignment:', error);
        }
    };

    const scheduleStudyTime = (assignment, studySessions) => {
        // This will be implemented with the assignment scheduler
        console.log('Scheduling study time for:', assignment, studySessions);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error.message}</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <DayWeaveLogo size={60} showText={false} />
                <div className="user-info">
                    <span>Welcome, {user.displayName || user.email}</span>
                    <button onClick={() => auth.signOut()}>Sign Out</button>
                </div>
            </header>

            <nav className="dashboard-nav">
                <button 
                    className={view === 'calendar' ? 'active' : ''}
                    onClick={() => setView('calendar')}
                >
                    Calendar
                </button>
                <button 
                    className={view === 'assignments' ? 'active' : ''}
                    onClick={() => setView('assignments')}
                >
                    Assignments
                </button>
                <button 
                    className={view === 'scheduler' ? 'active' : ''}
                    onClick={() => setView('scheduler')}
                >
                    Scheduler
                </button>
                <button 
                    className={view === 'canvas' ? 'active' : ''}
                    onClick={() => setView('canvas')}
                >
                    Canvas Sync
                </button>
                <button 
                    className={view === 'settings' ? 'active' : ''}
                    onClick={() => setView('settings')}
                >
                    Settings
                </button>
            </nav>

            <main className="dashboard-main">
                {view === 'calendar' && (
                    <Calendar 
                        assignments={assignments}
                        courses={courses}
                        scheduledEvents={scheduledEvents}
                        onAddAssignment={addAssignment}
                        onUpdateAssignment={updateAssignment}
                        onDeleteAssignment={deleteAssignment}
                    />
                )}
                {view === 'assignments' && (
                    <AssignmentList 
                        assignments={assignments}
                        onUpdateAssignment={updateAssignment}
                        onDeleteAssignment={deleteAssignment}
                        onScheduleStudyTime={scheduleStudyTime}
                    />
                )}
                {view === 'scheduler' && (
                    <AssignmentScheduler 
                        assignments={assignments}
                        courses={courses}
                        userId={user?.uid}
                        onStudyTimeScheduled={scheduleStudyTime}
                    />
                )}
                {view === 'canvas' && (
                    <CanvasIntegration 
                        onAssignmentsLoaded={setAssignments}
                        onCoursesLoaded={setCourses}
                    />
                )}
                {view === 'settings' && (
                    <Settings userId={user?.uid} />
                )}
            </main>
        </div>
    );
};

export default Dashboard;
