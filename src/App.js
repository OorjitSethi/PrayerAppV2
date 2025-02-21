// src/App.js

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy-loaded components for code splitting
const PrayerList = lazy(() => import('./components/PrayerList'));
const PrayerDetail = lazy(() => import('./components/PrayerDetail'));
const CreateSession = lazy(() => import('./components/CreateSession'));
const JoinSession = lazy(() => import('./components/JoinSession'));
const SessionPage = lazy(() => import('./components/SessionPage'));
const NotFound = () => (
  <div className="not-found">
    <h2>404 - Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<PrayerList />} />
          <Route path="/prayer/:prayerId" element={<PrayerDetail />} />
          <Route path="/create-session" element={<CreateSession />} />
          <Route path="/join-session" element={<JoinSession />} />
          <Route path="/session/:sessionId" element={<SessionPage />} />
          <Route path="*" element={<NotFound />} /> {/* 404 Route */}
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;
