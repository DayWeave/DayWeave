import React from 'react';
import "./Contact.css";
import Navbar from "../NavBar/NavBar";

import teamImage from '../assets/team-img.jpg'

const Contact = () => {

    const imageDescription = <span>Left: Nathan Xie | Middle: Reece Coppage | Right: Adwaith Ramesh</span>;
    const teamDescription1 = <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint.</span>;
    const teamDescription2 = <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.</span>;
    const teamDescription3 = <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.</span>;

    return (
        <div className="contact-page">
            <Navbar></Navbar>
            <div className="contact-page-content">
                <div className="contact-left-side">
                    <h1 className="contact-team-title">About The Team</h1>
                    <div className="contact-team-image-box">
                        <img className="contact-team-image" src={teamImage} />
                        <p className="contact-team-image-description">{imageDescription}</p>
                    </div>
                    <p className="contact-team-description">{teamDescription1}</p>
                    <p className="contact-team-description">{teamDescription2}</p>
                    <p className="contact-team-description">{teamDescription3}</p>
                </div>
                <div className="contact-vertical-line" />
                <div className="contact-right-side">
                    <h1 className="contact-title">Contact Us</h1>
                    <form className="contact-form">
                        <div className="contact-form-user-input">
                            <div className="contact-form-input-box">
                                <label htmlFor="name" className="contact-name-title">
                                    <span className="contact-req-asterisk">*</span> 
                                &nbsp; Enter your Name: </label>
                                <input 
                                    className="contact-form-input contact-name-input"
                                    id="name"
                                    type="name"
                                    name="name"
                                    placeholder="Name"
                                    required
                                />
                            </div>
                            <div className="contact-form-input-box">
                                <label htmlFor="email" className="contact-email-title">
                                    <span className="contact-req-asterisk">*</span> 
                                &nbsp; Enter your Email: </label>
                                <input 
                                className="contact-form-input contact-email-input"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                            />
                            </div>
                        </div>
                        <div className="contact-form-select">
                            <label htmlFor="contact-reason" className="contact-reason-title">
                                    <span className="contact-req-asterisk">*</span> 
                            &nbsp; Reason For Contacting Us</label>
                            <div className="contact-form-button-box">
                                <label className="contact-form-button-label">
                                    <input
                                        className="contact-form-button"
                                        id="contact-reason"
                                        type="radio"
                                        name="radio"
                                        value="Feature Request"
                                    />Feature Request
                                </label>
                                <label className="contact-form-button-label">
                                    <input
                                        className="contact-form-button"
                                        id="contact-reason"
                                        type="radio"
                                        name="radio"
                                        value="Bug / Issue" 
                                    />Bug / Issue
                                </label>
                                <label className="contact-form-button-label">
                                    <input
                                        className="contact-form-button"
                                        id="contact-reason"
                                        type="radio"
                                        name="radio"
                                        value="Other" 
                                    />Other
                                </label>
                            </div>
                        </div>
                        <div className="contact-form-input-box">
                            <p className="contact-description-title">
                                        <span className="contact-req-asterisk">*</span> 
                                &nbsp; Description</p>
                            <textarea 
                                className="contact-form-input contact-description-input"
                                type="description"
                                name="description"
                                placeholder="Description"
                                required
                            />
                        </div>
                        <div className="contact-submit-button-box">
                            <input 
                                className="contact-submit-button"
                                type="submit"
                                value="Submit"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact;