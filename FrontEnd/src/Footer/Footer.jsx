import React from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div className="Footer">
            <p>&copy; {currentYear} DayWeave. All rights reserved.</p>
        </div>
    );
};

export default Footer;
