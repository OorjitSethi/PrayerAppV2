// src/components/QRCodeComponent.js
import React from 'react';
import QRCode from 'react-qr-code'; // Named import

const QRCodeComponent = ({ value, size = 128 }) => {
  return (
    <div style={{ height: size, width: size }}>
      <QRCode value={value} size={size} />
    </div>
  );
};

export default QRCodeComponent;
