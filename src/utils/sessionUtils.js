// src/utils/sessionUtils.js
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';

// Generates a unique 5-character alphanumeric Session ID
export const generateSessionId = async () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id;
  let exists = true;

  while (exists) {
    id = '';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const q = query(collection(db, 'sessions'), where('__name__', '==', id));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      exists = false;
    }
  }

  return id;
};

// Creates a new session with the given prayer ID
export const createSession = async (prayerId) => {
  const sessionId = await generateSessionId();

  await addDoc(doc(db, 'sessions', sessionId), {
    prayerId: prayerId,
    participants: [],
    timestamp: new Date(),
    currentSectionIndex: 0,
    scrollPosition: 0.0
  });

  return sessionId;
};

// Joins a session by adding the participant's ID
export const joinSession = async (sessionId, participantId) => {
  const sessionRef = doc(db, 'sessions', sessionId);
  await updateDoc(sessionRef, {
    participants: arrayUnion(participantId)
  });
};
