import React, { useState } from 'react';
import './AssignmentList.css';

const AssignmentList = ({ assignments, onUpdateAssignment, onDeleteAssignment, onScheduleStudyTime }) => {
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed', 'overdue'
    const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate', 'priority', 'title'
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [editForm, setEditForm] = useState({});

    const getFilteredAssignments = () => {
        let filtered = [...assignments];

        // Apply filter
        const now = new Date();
        switch (filter) {
            case 'pending':
                filtered = filtered.filter(assignment => !assignment.completed);
                break;
            case 'completed':
                filtered = filtered.filter(assignment => assignment.completed);
                break;
            case 'overdue':
                filtered = filtered.filter(assignment => 
                    !assignment.completed && new Date(assignment.dueDate) < now
                );
                break;
            default:
                break;
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'dueDate':
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        return filtered;
    };

    const handleEdit = (assignment) => {
        setEditingAssignment(assignment.id);
        setEditForm({
            title: assignment.title,
            description: assignment.description,
            dueDate: assignment.dueDate.split('T')[0] + 'T' + assignment.dueDate.split('T')[1].substring(0, 5),
            course: assignment.course || '',
            estimatedHours: assignment.estimatedHours || 1,
            priority: assignment.priority || 'medium'
        });
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        onUpdateAssignment(editingAssignment, {
            ...editForm,
            dueDate: new Date(editForm.dueDate).toISOString()
        });
        setEditingAssignment(null);
        setEditForm({});
    };

    const handleCancelEdit = () => {
        setEditingAssignment(null);
        setEditForm({});
    };

    const handleToggleComplete = (assignment) => {
        onUpdateAssignment(assignment.id, { completed: !assignment.completed });
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ff4757';
            case 'medium': return '#ffa502';
            case 'low': return '#00d4aa';
            default: return '#4a9eff';
        }
    };

    const getPriorityLabel = (priority) => {
        return priority.charAt(0).toUpperCase() + priority.slice(1);
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date() && !assignments.find(a => a.dueDate === dueDate)?.completed;
    };

    const getDaysUntilDue = (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const filteredAssignments = getFilteredAssignments();

    return (
        <div className="assignment-list-container">
            <div className="assignment-list-header">
                <h2>Assignments</h2>
                <div className="assignment-controls">
                    <div className="filter-controls">
                        <label>Filter:</label>
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                    
                    <div className="sort-controls">
                        <label>Sort by:</label>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="dueDate">Due Date</option>
                            <option value="priority">Priority</option>
                            <option value="title">Title</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="assignment-stats">
                <div className="stat-item">
                    <span className="stat-number">{assignments.filter(a => !a.completed).length}</span>
                    <span className="stat-label">Pending</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{assignments.filter(a => a.completed).length}</span>
                    <span className="stat-label">Completed</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{assignments.filter(a => isOverdue(a.dueDate)).length}</span>
                    <span className="stat-label">Overdue</span>
                </div>
            </div>

            <div className="assignment-list">
                {filteredAssignments.length === 0 ? (
                    <div className="no-assignments">
                        <p>No assignments found</p>
                        <p>Try adjusting your filters or add a new assignment</p>
                    </div>
                ) : (
                    filteredAssignments.map(assignment => (
                        <div 
                            key={assignment.id} 
                            className={`assignment-item ${assignment.completed ? 'completed' : ''} ${isOverdue(assignment.dueDate) ? 'overdue' : ''}`}
                        >
                            {editingAssignment === assignment.id ? (
                                <form onSubmit={handleSaveEdit} className="edit-form">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            value={editForm.title}
                                            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                            placeholder="Assignment title"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <textarea
                                            value={editForm.description}
                                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                            placeholder="Description"
                                        />
                                    </div>
                                    
                                    <div className="form-row">
                                        <div className="form-group">
                                            <input
                                                type="datetime-local"
                                                value={editForm.dueDate}
                                                onChange={(e) => setEditForm({...editForm, dueDate: e.target.value})}
                                                required
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                value={editForm.course}
                                                onChange={(e) => setEditForm({...editForm, course: e.target.value})}
                                                placeholder="Course"
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                min="1"
                                                value={editForm.estimatedHours}
                                                onChange={(e) => setEditForm({...editForm, estimatedHours: parseInt(e.target.value)})}
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <select
                                                value={editForm.priority}
                                                onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="form-actions">
                                        <button type="button" onClick={handleCancelEdit}>
                                            Cancel
                                        </button>
                                        <button type="submit">Save</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="assignment-main">
                                        <div className="assignment-header">
                                            <h3 className="assignment-title">{assignment.title}</h3>
                                            <div className="assignment-meta">
                                                <span 
                                                    className="priority-badge"
                                                    style={{ backgroundColor: getPriorityColor(assignment.priority) }}
                                                >
                                                    {getPriorityLabel(assignment.priority)}
                                                </span>
                                                {isOverdue(assignment.dueDate) && (
                                                    <span className="overdue-badge">Overdue</span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {assignment.description && (
                                            <p className="assignment-description">{assignment.description}</p>
                                        )}
                                        
                                        <div className="assignment-details">
                                            <div className="detail-item">
                                                <span className="detail-label">Due:</span>
                                                <span className={`detail-value ${isOverdue(assignment.dueDate) ? 'overdue' : ''}`}>
                                                    {new Date(assignment.dueDate).toLocaleString()}
                                                </span>
                                            </div>
                                            
                                            {assignment.course && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Course:</span>
                                                    <span className="detail-value">{assignment.course}</span>
                                                </div>
                                            )}
                                            
                                            <div className="detail-item">
                                                <span className="detail-label">Est. Hours:</span>
                                                <span className="detail-value">{assignment.estimatedHours}</span>
                                            </div>
                                            
                                            <div className="detail-item">
                                                <span className="detail-label">Days Left:</span>
                                                <span className={`detail-value ${getDaysUntilDue(assignment.dueDate) < 0 ? 'overdue' : getDaysUntilDue(assignment.dueDate) < 3 ? 'urgent' : ''}`}>
                                                    {getDaysUntilDue(assignment.dueDate) < 0 ? 'Overdue' : getDaysUntilDue(assignment.dueDate)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="assignment-actions">
                                        <button 
                                            className={`complete-btn ${assignment.completed ? 'completed' : ''}`}
                                            onClick={() => handleToggleComplete(assignment)}
                                        >
                                            {assignment.completed ? '✓ Completed' : 'Mark Complete'}
                                        </button>
                                        
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEdit(assignment)}
                                        >
                                            Edit
                                        </button>
                                        
                                        <button 
                                            className="schedule-btn"
                                            onClick={() => onScheduleStudyTime(assignment)}
                                        >
                                            Schedule Study
                                        </button>
                                        
                                        <button 
                                            className="delete-btn"
                                            onClick={() => onDeleteAssignment(assignment.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AssignmentList;

