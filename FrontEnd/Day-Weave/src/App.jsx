import React from 'react';
import './App.css';
import { getCurrentYear } from './components/utils';
import Navbar from './components/NavBar';

function App() {
    const currentYear = new Date().getFullYear();

    return (
        <div id="page">
            <header className="header">
                <h1>DayWeave</h1>
            </header>
            <nav className="nav">
                <button onClick={() => window.location.href = '/about'}>About Us</button>
                <button onClick={() => window.location.href = '/contact'}>Contact</button>
            </nav>
            <nav className="auth-bar">
                <button onClick={() => window.location.href = '/login'}>Log In</button>
                <button onClick={() => window.location.href = '/signup'}>Sign Up</button>
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

export default App;
