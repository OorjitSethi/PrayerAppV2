// src/components/Footer.js
import React from 'react';
import QRCodeComponent from './QRCodeComponent'; // Correctly importing QRCodeComponent
import './Footer.css'; // Optional: CSS for styling

const Footer = () => {
  const qrValue = `${window.location.origin}/join-session`;

  return (
    <footer className="footer">
      <p>Join a Prayer Session:</p>
      <QRCodeComponent value={qrValue} size={128} />
    </footer>
  );
};

export default Footer;
