import React from 'react';

const OfflinePage: React.FC = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f3ff',
    color: '#6C47FF',
    textAlign: 'center',
    padding: '2rem'
  }}>
    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔮</div>
    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>You're Offline</h1>
    <p style={{ fontSize: '1.2rem', color: '#444', maxWidth: 400 }}>
      It looks like you've lost your internet connection.<br />
      Please check your network and try again.<br />
      Bhavisyaji will be here when you're back online!
    </p>
  </div>
);

export default OfflinePage; 