import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './Home/Home';
import Signup from './Signup/Signup';
import Login from './Login/Login';
import Contact from './Contact/Contact';
import Dashboard from './Dashboard/Dashboard';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}

export default App;
