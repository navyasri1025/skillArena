import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import StudentPage from './StudentPage';
import TeacherMode from './TeacherMode';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/teacher-mode" element={<TeacherMode />} />
      </Routes>
    </Router>
  );
}

export default App;