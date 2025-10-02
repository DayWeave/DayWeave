import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = ({ assignments, courses, scheduledEvents, onAddAssignment, onUpdateAssignment, onDeleteAssignment }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month'); // 'month', 'week', 'day'
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddAssignment, setShowAddAssignment] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        description: '',
        dueDate: '',
        course: '',
        estimatedHours: 1,
        priority: 'medium'
    });

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const getEventsForDate = (date) => {
        if (!date) return [];
        
        const dateStr = date.toDateString();
        return [
            ...assignments.filter(assignment => 
                new Date(assignment.dueDate).toDateString() === dateStr
            ),
            ...scheduledEvents.filter(event => 
                new Date(event.startTime).toDateString() === dateStr
            )
        ];
    };

    const getWeekDays = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            weekDays.push(day);
        }
        return weekDays;
    };

    const handleAddAssignment = (e) => {
        e.preventDefault();
        if (newAssignment.title && newAssignment.dueDate) {
            onAddAssignment({
                ...newAssignment,
                dueDate: new Date(newAssignment.dueDate).toISOString(),
                createdAt: new Date().toISOString()
            });
            setNewAssignment({
                title: '',
                description: '',
                dueDate: '',
                course: '',
                estimatedHours: 1,
                priority: 'medium'
            });
            setShowAddAssignment(false);
        }
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const navigateWeek = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + (direction * 7));
            return newDate;
        });
    };

    const navigateDay = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + direction);
            return newDate;
        });
    };

    const renderMonthView = () => {
        const days = getDaysInMonth(currentDate);
        
        return (
            <div className="calendar-grid">
                {daysOfWeek.map(day => (
                    <div key={day} className="calendar-header">{day}</div>
                ))}
                {days.map((day, index) => {
                    const events = getEventsForDate(day);
                    const isToday = day && day.toDateString() === new Date().toDateString();
                    const isSelected = day && day.toDateString() === selectedDate.toDateString();
                    
                    return (
                        <div 
                            key={index} 
                            className={`calendar-day ${!day ? 'empty' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => day && setSelectedDate(day)}
                        >
                            {day && (
                                <>
                                    <div className="day-number">{day.getDate()}</div>
                                    <div className="day-events">
                                        {events.slice(0, 3).map((event, eventIndex) => (
                                            <div 
                                                key={eventIndex} 
                                                className={`event ${event.type || 'assignment'}`}
                                                title={event.title}
                                            >
                                                {event.title}
                                            </div>
                                        ))}
                                        {events.length > 3 && (
                                            <div className="more-events">+{events.length - 3} more</div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderWeekView = () => {
        const weekDays = getWeekDays(currentDate);
        
        return (
            <div className="week-view">
                {weekDays.map((day, index) => {
                    const events = getEventsForDate(day);
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isSelected = day.toDateString() === selectedDate.toDateString();
                    
                    return (
                        <div 
                            key={index} 
                            className={`week-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedDate(day)}
                        >
                            <div className="week-day-header">
                                <div className="day-name">{daysOfWeek[index]}</div>
                                <div className="day-number">{day.getDate()}</div>
                            </div>
                            <div className="week-day-events">
                                {events.map((event, eventIndex) => (
                                    <div 
                                        key={eventIndex} 
                                        className={`event ${event.type || 'assignment'}`}
                                        title={event.title}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderDayView = () => {
        const events = getEventsForDate(currentDate);
        const isToday = currentDate.toDateString() === new Date().toDateString();
        
        return (
            <div className="day-view">
                <div className="day-header">
                    <h3>{currentDate.toDateString()}</h3>
                    {isToday && <span className="today-badge">Today</span>}
                </div>
                <div className="day-events-list">
                    {events.length === 0 ? (
                        <div className="no-events">No events scheduled for this day</div>
                    ) : (
                        events.map((event, index) => (
                            <div key={index} className={`event-item ${event.type || 'assignment'}`}>
                                <div className="event-title">{event.title}</div>
                                {event.description && (
                                    <div className="event-description">{event.description}</div>
                                )}
                                {event.dueDate && (
                                    <div className="event-time">
                                        Due: {new Date(event.dueDate).toLocaleString()}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <div className="calendar-controls">
                    <button onClick={() => navigateMonth(-1)}>‹</button>
                    <h2>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                    <button onClick={() => navigateMonth(1)}>›</button>
                </div>
                
                <div className="view-controls">
                    <button 
                        className={view === 'month' ? 'active' : ''}
                        onClick={() => setView('month')}
                    >
                        Month
                    </button>
                    <button 
                        className={view === 'week' ? 'active' : ''}
                        onClick={() => setView('week')}
                    >
                        Week
                    </button>
                    <button 
                        className={view === 'day' ? 'active' : ''}
                        onClick={() => setView('day')}
                    >
                        Day
                    </button>
                </div>

                <button 
                    className="add-assignment-btn"
                    onClick={() => setShowAddAssignment(true)}
                >
                    + Add Assignment
                </button>
            </div>

            <div className="calendar-content">
                {view === 'month' && renderMonthView()}
                {view === 'week' && renderWeekView()}
                {view === 'day' && renderDayView()}
            </div>

            {showAddAssignment && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Add New Assignment</h3>
                        <form onSubmit={handleAddAssignment}>
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={newAssignment.title}
                                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={newAssignment.description}
                                    onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Due Date *</label>
                                <input
                                    type="datetime-local"
                                    value={newAssignment.dueDate}
                                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Course</label>
                                <input
                                    type="text"
                                    value={newAssignment.course}
                                    onChange={(e) => setNewAssignment({...newAssignment, course: e.target.value})}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Estimated Hours</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={newAssignment.estimatedHours}
                                    onChange={(e) => setNewAssignment({...newAssignment, estimatedHours: parseInt(e.target.value)})}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Priority</label>
                                <select
                                    value={newAssignment.priority}
                                    onChange={(e) => setNewAssignment({...newAssignment, priority: e.target.value})}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowAddAssignment(false)}>
                                    Cancel
                                </button>
                                <button type="submit">Add Assignment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;

