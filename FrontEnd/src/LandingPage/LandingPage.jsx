import React from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";

function Home() {
    return (
        <div id='screen'>
            <Navbar></Navbar>
            <div id="page">
            
                <header className="header">
                    <h1>DayWeave</h1>
                </header>
                <body className='calandar_description'>
                Say goodbye to missed deadlines and last-minute cramming! DayWeave automatically syncs your 
                Canvas schedule and assignments, organizing them into a dynamic calendar that adapts to your workflow. 
                As you complete assignments, DayWeave learns how long tasks take and optimizes your study plan—helping 
                you stay ahead with less stress. <br/>📅 Auto-Synced Schedule | ⏳ Smart Time Adjustments | ✅ Better Productivity
                <br />Ready to take control of your time?
                </body>
                    <button onClick={() => window.location.href = '#create'}>Create New Calendar</button>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Home;
