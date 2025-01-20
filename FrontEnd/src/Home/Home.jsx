import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
    const currentYear = new Date().getFullYear();

    return (
        <div id="page">
            <header className="header">
                <h1>DayWeave</h1>
            </header>

            <nav className="nav">
                <button className="about-btn">About Us</button>
                <button className="contact-btn">Contact</button>
            </nav>

            <nav className="auth-bar">
                <Link to="/login">
                    <button className="auth-btn">Log In</button>
                </Link>
                <Link to="/signup">
                    <button className="signup-btn">Sign Up</button>
                </Link>
            </nav>

            <div className="hero">
                <h1>Stay Organized, Always</h1>
                <p>Plan, manage, and keep track of your schedule with ease.</p>
                <section id="tutorial">
                    <h2>Tutorial</h2>
                    <p>Learn how to use the app with our <a href="#">step-by-step guide</a>.</p>
                </section>
                <button onClick={() => window.location.href = '#create'}>Create New Calendar</button>
            </div>

            <footer className="footer">
                <p>&copy; {currentYear} DayWeave. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
