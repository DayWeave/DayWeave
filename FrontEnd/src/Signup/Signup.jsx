import React from 'react';
import "./Signup.css";

function Signup() {
    return (
        <div className="signup-page">
            <div className="signup-card">
                <h1 className="signup-title">Sign Up</h1>
                <form className="form">
                    <div className="form-input">
                        <input className="form-field" type="text" placeholder="Email Address" />
                        <input className="form-field" type="password" placeholder="Password" />
                        <input className="form-field" type="password" placeholder="Confirm Password" />
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