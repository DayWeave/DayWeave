import React, { useState, useEffect } from 'react';
import './CanvasIntegration.css';

const CanvasIntegration = ({ onAssignmentsLoaded, onCoursesLoaded }) => {
    const [canvasToken, setCanvasToken] = useState('');
    const [canvasUrl, setCanvasUrl] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [syncSettings, setSyncSettings] = useState({
        autoSync: false,
        syncFrequency: 'daily', // 'hourly', 'daily', 'weekly'
        includePastAssignments: false,
        includeCompletedAssignments: false
    });

    // Load saved settings from localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem('canvasToken');
        const savedUrl = localStorage.getItem('canvasUrl');
        const savedSettings = localStorage.getItem('canvasSyncSettings');
        
        if (savedToken) setCanvasToken(savedToken);
        if (savedUrl) setCanvasUrl(savedUrl);
        if (savedSettings) setSyncSettings(JSON.parse(savedSettings));
    }, []);

    const testConnection = async () => {
        if (!canvasToken || !canvasUrl) {
            setError('Please enter both Canvas URL and access token');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${canvasUrl}/api/v1/users/self`, {
                headers: {
                    'Authorization': `Bearer ${canvasToken}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setIsConnected(true);
                setError('');
                localStorage.setItem('canvasToken', canvasToken);
                localStorage.setItem('canvasUrl', canvasUrl);
                await loadCourses();
            } else {
                throw new Error('Invalid credentials or Canvas URL');
            }
        } catch (err) {
            setError(err.message);
            setIsConnected(false);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCourses = async () => {
        if (!isConnected) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${canvasUrl}/api/v1/courses?enrollment_state=active`, {
                headers: {
                    'Authorization': `Bearer ${canvasToken}`
                }
            });

            if (response.ok) {
                const coursesData = await response.json();
                setCourses(coursesData);
                onCoursesLoaded(coursesData);
            } else {
                throw new Error('Failed to load courses');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const loadAssignments = async () => {
        if (!isConnected || selectedCourses.length === 0) return;

        setIsLoading(true);
        try {
            const allAssignments = [];
            
            for (const courseId of selectedCourses) {
                const response = await fetch(
                    `${canvasUrl}/api/v1/courses/${courseId}/assignments?per_page=100`,
                    {
                        headers: {
                            'Authorization': `Bearer ${canvasToken}`
                        }
                    }
                );

                if (response.ok) {
                    const courseAssignments = await response.json();
                    const course = courses.find(c => c.id === courseId);
                    
                    const formattedAssignments = courseAssignments
                        .filter(assignment => {
                            if (!syncSettings.includeCompletedAssignments && assignment.submission?.workflow_state === 'submitted') {
                                return false;
                            }
                            if (!syncSettings.includePastAssignments && new Date(assignment.due_at) < new Date()) {
                                return false;
                            }
                            return true;
                        })
                        .map(assignment => ({
                            id: `canvas_${assignment.id}`,
                            title: assignment.name,
                            description: assignment.description || '',
                            dueDate: assignment.due_at,
                            course: course?.name || 'Unknown Course',
                            courseId: courseId,
                            estimatedHours: estimateHoursFromPoints(assignment.points_possible) || 2,
                            priority: getPriorityFromDueDate(assignment.due_at),
                            source: 'canvas',
                            canvasId: assignment.id,
                            url: assignment.html_url
                        }));

                    allAssignments.push(...formattedAssignments);
                }
            }

            setAssignments(allAssignments);
            onAssignmentsLoaded(allAssignments);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const estimateHoursFromPoints = (points) => {
        if (!points) return 2;
        // Rough estimation: 1 point = 30 minutes of work
        return Math.max(1, Math.ceil(points * 0.5));
    };

    const getPriorityFromDueDate = (dueDate) => {
        if (!dueDate) return 'medium';
        const daysUntilDue = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue <= 1) return 'high';
        if (daysUntilDue <= 3) return 'medium';
        return 'low';
    };

    const handleCourseToggle = (courseId) => {
        setSelectedCourses(prev => 
            prev.includes(courseId) 
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    const handleSelectAllCourses = () => {
        setSelectedCourses(courses.map(course => course.id));
    };

    const handleDeselectAllCourses = () => {
        setSelectedCourses([]);
    };

    const handleSyncSettingsChange = (key, value) => {
        const newSettings = { ...syncSettings, [key]: value };
        setSyncSettings(newSettings);
        localStorage.setItem('canvasSyncSettings', JSON.stringify(newSettings));
    };

    const disconnect = () => {
        setCanvasToken('');
        setCanvasUrl('');
        setIsConnected(false);
        setCourses([]);
        setAssignments([]);
        setSelectedCourses([]);
        setError('');
        localStorage.removeItem('canvasToken');
        localStorage.removeItem('canvasUrl');
    };

    return (
        <div className="canvas-integration">
            <div className="canvas-header">
                <h2>Canvas Integration</h2>
                <p>Connect your Canvas account to automatically sync assignments and course schedules</p>
            </div>

            {!isConnected ? (
                <div className="connection-section">
                    <div className="connection-form">
                        <div className="form-group">
                            <label htmlFor="canvasUrl">Canvas URL</label>
                            <input
                                id="canvasUrl"
                                type="url"
                                value={canvasUrl}
                                onChange={(e) => setCanvasUrl(e.target.value)}
                                placeholder="https://your-school.instructure.com"
                                required
                            />
                            <small>Enter your school's Canvas URL</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="canvasToken">Access Token</label>
                            <input
                                id="canvasToken"
                                type="password"
                                value={canvasToken}
                                onChange={(e) => setCanvasToken(e.target.value)}
                                placeholder="Your Canvas access token"
                                required
                            />
                            <small>
                                <a 
                                    href="https://community.canvaslms.com/t5/Canvas-Basics-Guide/How-do-I-manage-API-access-tokens-as-a-student/ta-p/273791" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    How to get your Canvas access token
                                </a>
                            </small>
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <button 
                            className="connect-btn"
                            onClick={testConnection}
                            disabled={isLoading || !canvasToken || !canvasUrl}
                        >
                            {isLoading ? 'Connecting...' : 'Connect to Canvas'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="connected-section">
                    <div className="connection-status">
                        <div className="status-indicator">
                            <span className="status-dot connected"></span>
                            <span>Connected to Canvas</span>
                        </div>
                        <button className="disconnect-btn" onClick={disconnect}>
                            Disconnect
                        </button>
                    </div>

                    <div className="courses-section">
                        <div className="section-header">
                            <h3>Select Courses to Sync</h3>
                            <div className="course-actions">
                                <button onClick={handleSelectAllCourses}>Select All</button>
                                <button onClick={handleDeselectAllCourses}>Deselect All</button>
                            </div>
                        </div>

                        <div className="courses-list">
                            {courses.map(course => (
                                <div key={course.id} className="course-item">
                                    <label className="course-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedCourses.includes(course.id)}
                                            onChange={() => handleCourseToggle(course.id)}
                                        />
                                        <span className="course-name">{course.name}</span>
                                    </label>
                                    <span className="course-code">{course.course_code}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sync-settings">
                        <h3>Sync Settings</h3>
                        <div className="settings-grid">
                            <div className="setting-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={syncSettings.autoSync}
                                        onChange={(e) => handleSyncSettingsChange('autoSync', e.target.checked)}
                                    />
                                    Auto-sync assignments
                                </label>
                            </div>

                            <div className="setting-item">
                                <label>
                                    Sync frequency:
                                    <select
                                        value={syncSettings.syncFrequency}
                                        onChange={(e) => handleSyncSettingsChange('syncFrequency', e.target.value)}
                                    >
                                        <option value="hourly">Hourly</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </label>
                            </div>

                            <div className="setting-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={syncSettings.includePastAssignments}
                                        onChange={(e) => handleSyncSettingsChange('includePastAssignments', e.target.checked)}
                                    />
                                    Include past assignments
                                </label>
                            </div>

                            <div className="setting-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={syncSettings.includeCompletedAssignments}
                                        onChange={(e) => handleSyncSettingsChange('includeCompletedAssignments', e.target.checked)}
                                    />
                                    Include completed assignments
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="sync-actions">
                        <button 
                            className="sync-btn"
                            onClick={loadAssignments}
                            disabled={isLoading || selectedCourses.length === 0}
                        >
                            {isLoading ? 'Syncing...' : 'Sync Assignments'}
                        </button>
                        
                        {assignments.length > 0 && (
                            <div className="sync-results">
                                <p>Successfully synced {assignments.length} assignments from {selectedCourses.length} courses</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CanvasIntegration;

