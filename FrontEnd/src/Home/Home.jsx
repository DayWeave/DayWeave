import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";

function Home() {
    return (
        <div>
            <Navbar></Navbar>
            <div id="page">
            
                <header className="header">
                    <h1>DayWeave</h1>
                </header>
                    <button onClick={() => window.location.href = '#create'}>Create New Calendar</button>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Home;
