import React from 'react';
import "./Signup.css";

import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Signup = () => {
    const navigate = useNavigate();
    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Getting the form values
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        createUserWithEmailAndPassword(email, password);
    };

    useEffect(() => {
        if (user) {
            // Redirect the user to the Home page (or another route of your choice)
            navigate('/'); // Redirects to the Home page after successful signup
        }
    }, [user, navigate]);

    return (
        <div className="signup-page">
            <div className="signup-card">
                <h1 className="signup-title">Sign Up</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-input">
                        <input 
                            className="form-field"
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            required
                        />
                        <input 
                            className="form-field"
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                        />
                        <input 
                            className="form-field"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            required
                        />
                    </div>
                    <div className="form-buttons">
                        <div className="form-details">
                            <input className="form-submit" type="submit" value="Sign Up" />
                            <p className="login-text">Already have an account? Log In.</p>
                        </div>
                        <br />
                        <div className="alternate-signup">
                            <button className="google-signup">Sign Up With Google</button>
                        </div>                        
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup;