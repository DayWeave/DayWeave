import React from "react";
import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
            <p className="Footer">&copy; {currentYear} DayWeave. All rights reserved.</p>
    );
};

export default Footer;
