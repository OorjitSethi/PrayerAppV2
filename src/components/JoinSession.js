// src/components/JoinSession.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import
import './JoinSession.css';

const JoinSession = () => {
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate(); // Updated hook

  const handleJoinSession = (e) => {
    e.preventDefault();
    if (sessionId.trim().length !== 5) {
      alert("Please enter a valid 5-character Session ID.");
      return;
    }

    // Redirect to session page
    navigate(`/session/${sessionId.trim()}`); // Updated navigation
  };

  return (
    <div className="join-session-container">
      <h1>Join a Prayer Session</h1>
      <form onSubmit={handleJoinSession} className="join-session-form">
        <label htmlFor="session-id">Enter Session ID:</label>
        <input
          type="text"
          id="session-id"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          maxLength={5}
          required
          placeholder="e.g., AbC12"
        />
        <button type="submit">Join Session</button>
      </form>
    </div>
  );
};

export default JoinSession;
