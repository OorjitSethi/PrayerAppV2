// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Optional: Create a CSS file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="navbar-brand">Prayer Reader</h2>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/create-session">Create Session</Link></li>
        <li><Link to="/join-session">Join Session</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
