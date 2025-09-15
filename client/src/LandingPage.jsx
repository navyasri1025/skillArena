import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="content">
        <h1 className="title">Welcome to LearnSphere</h1>
        <p className="intro">Your gateway to a world of knowledge. We provide a fun and interactive learning experience for students of all ages.</p>
        <div className="buttons">
          <Link to="/student">
            <button className="btn student-btn">For Students</button>
          </Link>
          <button className="btn parent-btn">For Parents</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;