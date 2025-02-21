// src/components/PrayerDetail.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import './PrayerDetail.css'; // Optional: Create a CSS file for styling

const PrayerDetail = () => {
  const { prayerId } = useParams();
  const [prayer, setPrayer] = useState(null);

  useEffect(() => {
    const fetchPrayer = async () => {
      try {
        const prayerRef = doc(db, 'prayers', prayerId);
        const prayerSnap = await getDoc(prayerRef);
        if (prayerSnap.exists()) {
          setPrayer(prayerSnap.data());
        } else {
          console.error("No such prayer!");
        }
      } catch (error) {
        console.error("Error fetching prayer:", error);
      }
    };

    fetchPrayer();
  }, [prayerId]);

  if (!prayer) return <div>Loading...</div>;

  return (
    <div className="prayer-detail-container">
      <h1>{prayer.title}</h1>
      <div className="prayer-content">
        {prayer.sections.map((section, index) => (
          <p key={index}>{section}</p>
        ))}
      </div>
      <p className="source-url">
        Source: <a href={prayer.sourceUrl} target="_blank" rel="noopener noreferrer">{prayer.sourceUrl}</a>
      </p>
    </div>
  );
};

export default PrayerDetail;
