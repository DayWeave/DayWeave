import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './Home.css';
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import DayWeaveLogo from '../components/DayWeaveLogo';

function Home() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    const handleCreateCalendar = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="home-page">
            <Navbar />
            
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Organize Your Academic Life with 
                            <span className="highlight"> Smart Scheduling</span>
                        </h1>
                        <p className="hero-description">
                            DayWeave automatically syncs your Canvas schedule and assignments, 
                            organizing them into a dynamic calendar that adapts to your workflow. 
                            Stay ahead with intelligent time management and never miss another deadline.
                        </p>
                        <div className="hero-features">
                            <div className="feature-item">
                                <div className="feature-icon">📅</div>
                                <span>Auto-Synced Schedule</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">⚡</div>
                                <span>Smart Time Adjustments</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">📈</div>
                                <span>Better Productivity</span>
                            </div>
                        </div>
                        <div className="hero-actions">
                            <button className="cta-button primary" onClick={handleCreateCalendar}>
                                {user ? 'Go to Dashboard' : 'Get Started Free'}
                            </button>
                            <button className="cta-button secondary">
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <DayWeaveLogo size={200} showText={true} />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Why Choose DayWeave?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-card-icon">🔄</div>
                            <h3>Automatic Canvas Sync</h3>
                            <p>Seamlessly import your courses and assignments from Canvas LMS with one-click integration.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-card-icon">🧠</div>
                            <h3>Smart Scheduling</h3>
                            <p>AI-powered study session planning that learns from your habits and optimizes your time.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-card-icon">📊</div>
                            <h3>Progress Tracking</h3>
                            <p>Monitor your academic progress with detailed analytics and performance insights.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready to Transform Your Academic Experience?</h2>
                    <p>Join thousands of students who are already using DayWeave to stay organized and productive.</p>
                    <button className="cta-button primary large" onClick={handleCreateCalendar}>
                        {user ? 'Go to Dashboard' : 'Start Your Free Account'}
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;
