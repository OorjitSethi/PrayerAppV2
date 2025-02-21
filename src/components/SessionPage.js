// src/components/SessionPage.js

// This page displays a shared prayer session where multiple users can follow along together
// One user is designated as the leader who controls navigation and scrolling
// Other users are participants who follow the leader's position

import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { useParams, useLocation } from 'react-router-dom';
import QRCodeComponent from './QRCodeComponent';
import { debounce } from 'lodash';
import './SessionPage.css';

// Helper function to get URL parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SessionPage = () => {
  // Get session ID from URL and check if user is leader
  const { sessionId } = useParams();
  const query = useQuery();
  const leaderFlag = query.get('leader') === 'true';

  // Track session data, prayer content, and state
  const [session, setSession] = useState(null);
  const [prayer, setPrayer] = useState(null);
  const [isLeader, setIsLeader] = useState(leaderFlag);
  const prayerContentRef = useRef(null);
  const isParticipantScrolling = useRef(false);

  useEffect(() => {
    // Load initial session and prayer data
    const fetchSessionAndPrayer = async () => {
      try {
        const sessionRef = doc(db, 'sessions', sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if (sessionSnap.exists()) {
          setSession({ id: sessionSnap.id, ...sessionSnap.data() });

          // Get the prayer content associated with this session
          const prayerRef = doc(db, 'prayers', sessionSnap.data().prayerId);
          const prayerSnap = await getDoc(prayerRef);
          if (prayerSnap.exists()) {
            setPrayer(prayerSnap.data());
          }
        } else {
          console.error("Session does not exist.");
        }
      } catch (error) {
        console.error("Error fetching session or prayer:", error);
      }
    };

    fetchSessionAndPrayer();

    // Listen for real-time updates to session data
    // This allows participants to follow the leader's position
    const sessionRef = doc(db, 'sessions', sessionId);
    const unsubscribe = onSnapshot(sessionRef, (docSnap) => {
      if (docSnap.exists()) {
        const updatedSession = { id: docSnap.id, ...docSnap.data() };
        setSession(updatedSession);

        // Update participant scroll position to match leader
        if (!isLeader && prayerContentRef.current) {
          isParticipantScrolling.current = true;
          prayerContentRef.current.scrollTo({
            top: updatedSession.scrollPosition || 0,
            behavior: 'smooth'
          });
          setTimeout(() => {
            isParticipantScrolling.current = false;
          }, 1000); // Increased timeout to account for smooth scrolling
        }
      }
    });

    return () => unsubscribe();
  }, [sessionId, leaderFlag, isLeader]);

  // Update database when leader scrolls, so participants can follow
  const handleScroll = debounce(async (e) => {
    if (isLeader && !isParticipantScrolling.current) {
      const scrollTop = e.target.scrollTop;
      const sessionRef = doc(db, 'sessions', sessionId);
      await updateDoc(sessionRef, {
        scrollPosition: scrollTop,
        lastUpdated: new Date().toISOString() // Add timestamp to ensure updates are processed
      });
    }
  }, 50); // Reduced debounce time for smoother updates

  if (!prayer || !session) return <div>Loading...</div>;

  return (
    <div className="session-page-container">
      <h1>{prayer.title}</h1>
      <div className="session-details">
        <p><strong>Session ID:</strong> {sessionId}</p>
        <p><strong>Share this link to join as participant:</strong></p>
        <a href={`${window.location.origin}/session/${sessionId}`} target="_blank" rel="noopener noreferrer">
          {`${window.location.origin}/session/${sessionId}`}
        </a>
        <div className="qr-code">
          <p><strong>Scan to join as participant:</strong></p>
          <QRCodeComponent value={`${window.location.origin}/session/${sessionId}`} size={128} />
        </div>
        {/* Show additional leader sharing options only to leader */}
        {isLeader && (
          <>
            <p><strong>Share this link to join as leader:</strong></p>
            <a href={`${window.location.origin}/session/${sessionId}?leader=true`} target="_blank" rel="noopener noreferrer">
              {`${window.location.origin}/session/${sessionId}?leader=true`}
            </a>
            <div className="qr-code">
              <p><strong>Scan to join as leader:</strong></p>
              <QRCodeComponent value={`${window.location.origin}/session/${sessionId}?leader=true`} size={128} />
            </div>
          </>
        )}
      </div>

      {/* Main prayer content that scrolls */}
      <div
        className="prayer-content"
        onScroll={handleScroll}
        ref={prayerContentRef}
      >
        {prayer.sections.map((section, index) => (
          <div key={index} className="prayer-section">
            {section.split('\n').map((line, lineIndex) => (
              <p key={lineIndex} style={{marginBottom: '0.5em'}}>{line}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionPage;
