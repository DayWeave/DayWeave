import React from "react";
import { Link } from "react-router-dom";
import LogoPlaceholder from "../assets/logoplaceholder.png"; // Adjust path if needed
import DayWeaveLogo from '../components/DayWeaveLogo';
import "./Navbar.css"; // Import CSS file

const Navbar = () => {
  return (
    <nav className="nav_bar">
      {/* Left Section: Logo + Contact */}
      <div className="nav_left">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <DayWeaveLogo size={80} showText={true} />
        </Link>
        <div className="nav_links">
          <Link to="/contact">
            <button className="contact">Contact</button>
          </Link>
        </div>
      </div>

      {/* Right Section: Auth buttons (Log In, Sign Up) */}
      <div className="nav_right">
        <div className="auth_bar">
          <Link to="/login">
            <button className="login">Log In</button>
          </Link>
          <Link to="/signup">
            <button className="signup">Sign Up</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
