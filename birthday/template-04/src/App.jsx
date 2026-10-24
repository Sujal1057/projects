import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EnvelopePage from './components/EnvelopePage';
import BirthdayBookPage from './components/BirthdayBookPage';
import BackgroundAudio from './components/BackgroundAudio';
import OrientationWrapper from './components/OrientationWrapper';
import './index.css';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartAudio = () => {
    setIsPlaying(true);
  };

  return (
    <Router>
      <OrientationWrapper>
        <BackgroundAudio isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
        <Routes>
          <Route
            path="/"
            element={<EnvelopePage onStartAudio={handleStartAudio} />}
          />
          <Route
            path="/page2"
            element={<BirthdayBookPage />}
          />
          <Route
            path="/page2.html"
            element={<Navigate to="/page2" replace />}
          />
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </OrientationWrapper>
    </Router>
  );
}
