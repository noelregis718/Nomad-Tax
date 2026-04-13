import React from 'react';

const MapChart = ({ stays = [] }) => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.02)',
      borderRadius: '1rem',
      color: 'var(--text-dim)',
      gap: '1rem'
    }}>
      <div className="loading-spinner" style={{ width: '30px', height: '30px', border: '3px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Stabilizing World Map Engine...</p>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MapChart;
