import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Settings.css';

const Settings = ({ userId }) => {
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            browser: true,
            assignmentReminders: true,
            studySessionReminders: true,
            dueDateWarnings: true
        },
        calendar: {
            defaultView: 'month',
            weekStartsOn: 'sunday',
            timeFormat: '12h',
            showWeekends: true
        },
        study: {
            defaultSessionLength: 2,
            defaultBreakLength: 0.5,
            maxSessionsPerDay: 4,
            preferredStudyTimes: {
                morning: { start: 9, end: 12 },
                afternoon: { start: 14, end: 17 },
                evening: { start: 19, end: 22 }
            },
            avoidWeekends: false,
            bufferDays: 1
        },
        appearance: {
            theme: 'dark',
            fontSize: 'medium',
            compactMode: false
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (userId) {
            loadSettings();
        }
    }, [userId]);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const settingsDoc = await getDoc(doc(db, 'userSettings', userId));
            if (settingsDoc.exists()) {
                setSettings(settingsDoc.data());
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            setMessage('Error loading settings');
        } finally {
            setIsLoading(false);
        }
    };

    const saveSettings = async () => {
        if (!userId) return;
        
        setIsSaving(true);
        try {
            await setDoc(doc(db, 'userSettings', userId), settings);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('Error saving settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSettingChange = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    const handleNestedSettingChange = (category, subCategory, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [subCategory]: {
                    ...prev[category][subCategory],
                    [key]: value
                }
            }
        }));
    };

    const resetToDefaults = () => {
        if (window.confirm('Are you sure you want to reset all settings to default values?')) {
            setSettings({
                notifications: {
                    email: true,
                    browser: true,
                    assignmentReminders: true,
                    studySessionReminders: true,
                    dueDateWarnings: true
                },
                calendar: {
                    defaultView: 'month',
                    weekStartsOn: 'sunday',
                    timeFormat: '12h',
                    showWeekends: true
                },
                study: {
                    defaultSessionLength: 2,
                    defaultBreakLength: 0.5,
                    maxSessionsPerDay: 4,
                    preferredStudyTimes: {
                        morning: { start: 9, end: 12 },
                        afternoon: { start: 14, end: 17 },
                        evening: { start: 19, end: 22 }
                    },
                    avoidWeekends: false,
                    bufferDays: 1
                },
                appearance: {
                    theme: 'dark',
                    fontSize: 'medium',
                    compactMode: false
                }
            });
        }
    };

    if (isLoading) {
        return <div className="loading">Loading settings...</div>;
    }

    return (
        <div className="settings">
            <div className="settings-header">
                <h2>Settings</h2>
                <p>Customize your DayWeave experience</p>
            </div>

            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <div className="settings-content">
                <div className="settings-section">
                    <h3>Notifications</h3>
                    <div className="settings-group">
                        {Object.entries(settings.notifications).map(([key, value]) => (
                            <label key={key} className="checkbox-setting">
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                                />
                                <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="settings-section">
                    <h3>Calendar</h3>
                    <div className="settings-group">
                        <div className="setting-item">
                            <label>Default View</label>
                            <select
                                value={settings.calendar.defaultView}
                                onChange={(e) => handleSettingChange('calendar', 'defaultView', e.target.value)}
                            >
                                <option value="month">Month</option>
                                <option value="week">Week</option>
                                <option value="day">Day</option>
                            </select>
                        </div>

                        <div className="setting-item">
                            <label>Week Starts On</label>
                            <select
                                value={settings.calendar.weekStartsOn}
                                onChange={(e) => handleSettingChange('calendar', 'weekStartsOn', e.target.value)}
                            >
                                <option value="sunday">Sunday</option>
                                <option value="monday">Monday</option>
                            </select>
                        </div>

                        <div className="setting-item">
                            <label>Time Format</label>
                            <select
                                value={settings.calendar.timeFormat}
                                onChange={(e) => handleSettingChange('calendar', 'timeFormat', e.target.value)}
                            >
                                <option value="12h">12 Hour</option>
                                <option value="24h">24 Hour</option>
                            </select>
                        </div>

                        <label className="checkbox-setting">
                            <input
                                type="checkbox"
                                checked={settings.calendar.showWeekends}
                                onChange={(e) => handleSettingChange('calendar', 'showWeekends', e.target.checked)}
                            />
                            <span>Show Weekends</span>
                        </label>
                    </div>
                </div>

                <div className="settings-section">
                    <h3>Study Preferences</h3>
                    <div className="settings-group">
                        <div className="setting-item">
                            <label>Default Session Length (hours)</label>
                            <input
                                type="number"
                                min="0.5"
                                max="4"
                                step="0.5"
                                value={settings.study.defaultSessionLength}
                                onChange={(e) => handleSettingChange('study', 'defaultSessionLength', parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="setting-item">
                            <label>Default Break Length (hours)</label>
                            <input
                                type="number"
                                min="0"
                                max="2"
                                step="0.25"
                                value={settings.study.defaultBreakLength}
                                onChange={(e) => handleSettingChange('study', 'defaultBreakLength', parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="setting-item">
                            <label>Max Sessions Per Day</label>
                            <input
                                type="number"
                                min="1"
                                max="8"
                                value={settings.study.maxSessionsPerDay}
                                onChange={(e) => handleSettingChange('study', 'maxSessionsPerDay', parseInt(e.target.value))}
                            />
                        </div>

                        <div className="setting-item">
                            <label>Buffer Days Before Due</label>
                            <input
                                type="number"
                                min="0"
                                max="7"
                                value={settings.study.bufferDays}
                                onChange={(e) => handleSettingChange('study', 'bufferDays', parseInt(e.target.value))}
                            />
                        </div>

                        <div className="time-preferences">
                            <h4>Preferred Study Times</h4>
                            {Object.entries(settings.study.preferredStudyTimes).map(([period, timeRange]) => (
                                <div key={period} className="time-range-setting">
                                    <label>{period.charAt(0).toUpperCase() + period.slice(1)}</label>
                                    <div className="time-inputs">
                                        <input
                                            type="number"
                                            min="0"
                                            max="23"
                                            value={timeRange.start}
                                            onChange={(e) => handleNestedSettingChange('study', 'preferredStudyTimes', period, {
                                                ...timeRange,
                                                start: parseInt(e.target.value)
                                            })}
                                        />
                                        <span>to</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="23"
                                            value={timeRange.end}
                                            onChange={(e) => handleNestedSettingChange('study', 'preferredStudyTimes', period, {
                                                ...timeRange,
                                                end: parseInt(e.target.value)
                                            })}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <label className="checkbox-setting">
                            <input
                                type="checkbox"
                                checked={settings.study.avoidWeekends}
                                onChange={(e) => handleSettingChange('study', 'avoidWeekends', e.target.checked)}
                            />
                            <span>Avoid Weekends</span>
                        </label>
                    </div>
                </div>

                <div className="settings-section">
                    <h3>Appearance</h3>
                    <div className="settings-group">
                        <div className="setting-item">
                            <label>Theme</label>
                            <select
                                value={settings.appearance.theme}
                                onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                            >
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                                <option value="auto">Auto</option>
                            </select>
                        </div>

                        <div className="setting-item">
                            <label>Font Size</label>
                            <select
                                value={settings.appearance.fontSize}
                                onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                            >
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>

                        <label className="checkbox-setting">
                            <input
                                type="checkbox"
                                checked={settings.appearance.compactMode}
                                onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                            />
                            <span>Compact Mode</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="settings-actions">
                <button 
                    className="reset-btn"
                    onClick={resetToDefaults}
                >
                    Reset to Defaults
                </button>
                <button 
                    className="save-btn"
                    onClick={saveSettings}
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
};

export default Settings;

