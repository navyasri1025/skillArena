import React from 'react';
import { Link } from 'react-router-dom';
import './GameModes.css';

const GameModes = () => {
  return (
    <div className="game-modes-container">
      <h1 className="page-title">Choose a Game Mode</h1>
      <div className="modes-grid">
        <Link to="/teacher-mode" className="mode-card teacher-mode">
          <h2>Teacher Mode</h2>
          <p>Explain a topic and get feedback on your explanation.</p>
        </Link>
        <div className="mode-card quiz-mode">
          <h2>Quiz Mode</h2>
          <p>Test your knowledge with multiple-choice questions.</p>
        </div>
        <div className="mode-card puzzle-mode">
          <h2>Puzzle Mode</h2>
          <p>Solve interactive puzzles to learn new concepts.</p>
        </div>
        <div className="mode-card challenge-mode">
          <h2>Challenge Mode</h2>
          <p>Compete with other students and climb the leaderboard.</p>
        </div>
      </div>
    </div>
  );
};

export default GameModes;