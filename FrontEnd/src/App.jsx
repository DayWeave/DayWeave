import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import LandingPage from './LandingPage/LandingPage';
import Signup from './Signup/Signup';
import Login from './Login/Login';

function App() {
    return (
        <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default App;
