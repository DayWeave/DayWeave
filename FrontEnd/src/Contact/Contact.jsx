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
                <div className="left-side">
                    <h1 className="team-title">About The Team</h1>
                    <div className="team-image-box">
                        <img className="team-image" src={teamImage} />
                        <p className="team-image-description">{imageDescription}</p>
                    </div>
                    <p className="team-description">{teamDescription1}</p>
                    <p className="team-description">{teamDescription2}</p>
                    <p className="team-description">{teamDescription3}</p>
                </div>
                <div className="vertical-line" />
                <div className="right-side">
                    <h1 className="contact-title">Contact Us</h1>
                    <form className="contact-form">
                        <div className="form-user-input">
                            <input 
                                className="form-input name-input"
                                type="name"
                                name="name"
                                placeholder="Name"
                                required
                            />
                            <input 
                                className="form-input email-input"
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                            />
                        </div>
                        <div className="form-select">
                            <label>
                                <input
                                    className="form-button"
                                    type="radio"
                                    name="radio"
                                    value="Option1"
                                />Option 1
                            </label>
                            <label>
                                <input
                                    className="form-button"
                                    type="radio"
                                    name="radio"
                                    value="Option2" 
                                />Option 2
                            </label>
                            <label>
                                <input
                                    className="form-button"
                                    type="radio"
                                    name="radio"
                                    value="Option3" 
                                />Option 3
                            </label>
                        </div>
                        <input 
                            className="form-input"
                            type="description"
                            name="description"
                            placeholder="Description"
                            required
                        />
                        <input 
                            className="submit-button"
                            type="submit"
                            value="Submit"
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact;