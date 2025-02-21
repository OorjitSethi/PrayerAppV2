// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBKjzh0b8AuBATHG2pPTZV2Hc61kSA3W0",
  authDomain: "prayerreaderwebapp.firebaseapp.com",
  projectId: "prayerreaderwebapp",
  storageBucket: "prayerreaderwebapp.firebasestorage.app",
  messagingSenderId: "930980741881",
  appId: "1:930980741881:web:bcde613f74bc7e21c65828",
  measurementId: "G-P7EZPWFE11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };