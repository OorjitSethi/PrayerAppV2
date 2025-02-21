// src/components/PrayerList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './PrayerList.css'; // Optional: Create a CSS file for styling

const PrayerList = () => {
  const [prayers, setPrayers] = useState([]);

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
      }
    };

    fetchPrayers();
  }, []);

  return (
    <div className="prayer-list-container">
      <h1>Available Prayers</h1>
      <ul className="prayer-list">
        {prayers.map(prayer => (
          <li key={prayer.id} className="prayer-item">
            <Link to={`/prayer/${prayer.id}`} className="prayer-link">
              {prayer.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrayerList;
