import React from "react";
import { Link } from "react-router-dom";
import LogoPlaceholder from "../assets/logoplaceholder.png"; // Adjust path if needed
import "./Navbar.css"; // Import CSS file

const Navbar = () => {
  return (
    <nav className="nav_bar">
      {/* Left Section: Logo + About + Contact */}
      <div className="nav_left">
        <img src={LogoPlaceholder} alt="Company Logo" className="logo" />
        <div className="nav_links">
          <button className="about">About Us</button>
          <button className="contact">Contact</button>
        </div>
      </div>

      {/* Right Section: Auth buttons (Log In, Sign Up, Tutorial) */}
      <div className="nav_right">
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
