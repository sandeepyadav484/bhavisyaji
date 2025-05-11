import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { t } = useTranslation();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#ffecb3',
      color: '#b26a00',
      textAlign: 'center',
      padding: '12px',
      zIndex: 1000,
      fontWeight: 'bold',
      boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
    }}>
      <span>🔌 {t('offline')}</span>
    </div>
  );
};

export default NetworkStatus; 