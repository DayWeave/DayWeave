import React from "react";
import { Link } from "react-router-dom";
import LogoPlaceholder from "../assets/logoplaceholder.png"; // Adjust path if needed
import "./Navbar.css"; // Import CSS file

const Navbar = () => {
  return (
    <nav className="nav_bar">
      {/* Logo on the Left */}
      <img src={LogoPlaceholder} alt="Company Logo" className="logo" />

      {/* Navigation Buttons on the Right */}
      <div className="nav_links">
        <button className="about">About Us</button>
        <button className="contact">Contact</button>

        {/* Authentication and Tutorial */}
        <div className="auth_bar">
          <Link to="/login">
            <button className="login">Log In</button>
          </Link>
          <Link to="/signup">
            <button className="signup">Sign Up</button>
          </Link>
          <button className="tutorial">Tutorial</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
