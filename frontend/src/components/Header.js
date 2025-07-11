import React from 'react';
import '../styles/Header.css';
import logo from '../assets/NEXUS-LOGO.jpg';
import profilePic from '../assets/profile.png'; 

const Header = () => {
  return (
    <header className="header-container">
      {/* Logo and Text Container (now side-by-side) */}
      <div className="logo-title-container">
        <img src={logo} alt="Learning Platform Logo" className="logo" />
        <h1 className="logo-text">NexusLearn</h1>
      </div>

      <nav className="nav-links">
        <a href="/HomePage" className="nav-button">Home</a>
        <a href="/myCourses" className="nav-button">My Courses</a>
        <a href="/courses" className="nav-button">Courses</a>
        <a href="/challenges" className="nav-button">Challenges</a>
      </nav>

      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search lessons, quizzes..." 
          className="search-input" 
        />
        <button className="search-button">Search</button>
      </div>

      <div className="profile-container">
        <img 
          src={profilePic}
          alt="Profile" 
          className="profile-icon" 
        />
      </div>
    </header>
  );
};

export default Header;