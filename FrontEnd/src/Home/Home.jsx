import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";

function Home() {
    return (
        <div id="page">
            <Navbar></Navbar>
            
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
            <Footer></Footer>
        </div>
    );
}

export default Home;
