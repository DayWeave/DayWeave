import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import Navbar from "../NavBar/NavBar";

function Home() {
    const currentYear = new Date().getFullYear();

    return (
        <div id="page">
            <div>
                <Navbar></Navbar>
            </div>

            <header className="header">
                <h1>DayWeave</h1>
            </header>

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
