import React, { useEffect, useState } from 'react';

const SyncStatus: React.FC = () => {
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleSyncStart = () => setSyncing(true);
    const handleSyncEnd = () => setSyncing(false);

    window.addEventListener('sync-start', handleSyncStart);
    window.addEventListener('sync-end', handleSyncEnd);

    return () => {
      window.removeEventListener('sync-start', handleSyncStart);
      window.removeEventListener('sync-end', handleSyncEnd);
    };
  }, []);

  if (!syncing) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: '#e3f2fd',
      color: '#1976d2',
      textAlign: 'center',
      padding: '8px',
      zIndex: 1001,
      fontWeight: 'bold',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <span>🔄 Syncing your data...</span>
    </div>
  );
};

export default SyncStatus; 