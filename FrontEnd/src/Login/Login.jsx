import React from 'react';
import "./Login.css";

import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import googleLogo from '../components/GoogleLogo.png';

const Login = () => {
    const navigate = useNavigate();
    const [signInWithEmailAndPassword, user] = useSignInWithEmailAndPassword(auth);
    const [signInWithGoogle, gUser] = useSignInWithGoogle(auth);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Getting the form values
        const email = e.target.email.value;
        const password = e.target.password.value;
    
        signInWithEmailAndPassword(email, password);
    };

    useEffect(() => {
            if (user || gUser) {
                // Currently redirects to home page after signup
                navigate('/');
            }
        }, [user, navigate, gUser]);

    return (
        <div className="login-page">
                    <div className="login-card">
                        <h1 className="login-title">Login</h1>
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
                                <p className="login-text">Don't have an account? Sign up!</p>
                            </div>
                            <div className="form-buttons">
                                <div className="form-details">
                                    <input className="form-submit" type="submit" value="Login" />
                                </div>
                                <br />
                                <div className="alternate-login">
                                    <div className="google-login" onClick={() => signInWithGoogle()}>
                                        <div className="google-img-box">
                                            <img className="google-img" src={googleLogo}/>
                                        </div>
                                        <p className="google-text">Login with Google</p>
                                    </div>
                                </div>                        
                            </div>
                        </form>
                    </div>
                </div>
    )
}

export default Login;