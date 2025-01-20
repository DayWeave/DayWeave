import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './Home/Home';
import Signup from './Signup/Signup';
import Login from './Login/Login';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default App;
