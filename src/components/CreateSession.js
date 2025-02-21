// src/components/CreateSession.js

import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Ensure the correct import path
import { collection, setDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import QRCodeComponent from './QRCodeComponent'; // Ensure correct path
import './CreateSession.css'; // Optional: Your CSS styling

const CreateSession = () => {
  const [prayers, setPrayers] = useState([]);
  const [selectedPrayer, setSelectedPrayer] = useState('');
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        const prayersCol = collection(db, 'prayers');
        const prayersSnapshot = await getDocs(prayersCol);
        const prayersList = prayersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPrayers(prayersList);
      } catch (error) {
        console.error("Error fetching prayers:", error);
        alert("Failed to fetch prayers. Please try again later.");
      }
    };

    fetchPrayers();
  }, []);

  // Function to generate a unique session ID
  const generateSessionId = async () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id;
    let exists = true;

    while (exists) {
      id = '';
      for (let i = 0; i < 6; i++) { // Increased length for uniqueness
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      // Check if the generated ID already exists
      const q = query(collection(db, 'sessions'), where('__name__', '==', id));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        exists = false;
      }
    }

    return id;
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!selectedPrayer) {
      alert("Please select a prayer to create a session.");
      return;
    }

    try {
      const newSessionId = await generateSessionId();

      // Create the session document first
      const sessionRef = doc(db, 'sessions', newSessionId);
      await setDoc(sessionRef, {
        prayerId: selectedPrayer,
        participants: [],
        timestamp: new Date(),
        currentSectionIndex: 0,
        scrollPosition: 0.0
      });

      // Only set the sessionId after successful creation
      setSessionId(newSessionId);

    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session. Please try again.");
    }
  };

  const handleGoToSession = () => {
    if (sessionId) {
      navigate(`/session/${sessionId}`);
    }
  };

  const handleCreateAnother = () => {
    setSessionId('');
    setSelectedPrayer('');
  };

  return (
    <div className="create-session-container">
      <h1>Create a New Prayer Session</h1>
      <form onSubmit={handleCreateSession} className="create-session-form">
        <label htmlFor="prayer-select">Select a Prayer:</label>
        <select
          id="prayer-select"
          value={selectedPrayer}
          onChange={(e) => setSelectedPrayer(e.target.value)}
          required
        >
          <option value="">--Choose a Prayer--</option>
          {prayers.map(prayer => (
            <option key={prayer.id} value={prayer.id}>{prayer.title}</option>
          ))}
        </select>
        <button type="submit">Start Session</button>
      </form>

      {sessionId && (
        <div className="session-details">
          <h2>Session Created!</h2>
          <p><strong>Session ID:</strong> {sessionId}</p>
          <p><strong>Share this link:</strong></p>
          <a href={`${window.location.origin}/session/${sessionId}`} target="_blank" rel="noopener noreferrer">
            {`${window.location.origin}/session/${sessionId}`}
          </a>
          <div className="qr-code">
            <QRCodeComponent value={`${window.location.origin}/session/${sessionId}`} size={256} />
          </div>
          <div className="confirmation-actions">
            <button 
              onClick={handleGoToSession}
              style={{
                padding: '15px 30px',
                fontSize: '1.2rem',
                margin: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              Go to Session
            </button>
            <button 
              onClick={handleCreateAnother}
              style={{
                padding: '15px 30px',
                fontSize: '1.2rem',
                margin: '10px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              Create Another Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSession;
