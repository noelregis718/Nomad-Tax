import React, { useState } from 'react';
import { Clock, Globe, Filter, Download } from 'lucide-react';
import Layout from '../components/Layout';
import MapChart from '../components/MapChart';
import axios from 'axios';

import { useTravel } from '../context/TravelContext';
import { useAuth } from '../context/AuthContext';

const TripCard = ({ stay, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(stay.notes || '');
  
  const start = new Date(stay.arrivalDate);
  const end = new Date(stay.departureDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;

  return (
    <div className="trip-feed-card" style={{ 
      padding: '1.25rem', 
      background: 'rgba(255,255,255,0.5)', 
      borderRadius: '12px', 
      border: '1px solid var(--glass-border)',
      marginBottom: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{stay.countryName}</h4>
            <span style={{ 
              fontSize: '0.7rem', 
              fontWeight: 800, 
              padding: '0.15rem 0.5rem', 
              background: 'var(--primary)', 
              color: 'white', 
              borderRadius: '6px' 
            }}>{days} DAYS</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: 0 }}>{stay.city} • {stay.category}</p>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.5rem' }}>
            {stay.arrivalDate.split('T')[0]} → {stay.departureDate.split('T')[0]}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            style={{ 
              padding: '0.4rem 0.75rem', 
              fontSize: '0.7rem', 
              fontWeight: 700, 
              borderRadius: '6px', 
              border: '1px solid var(--glass-border)',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            {isEditing ? 'HIDE' : 'ADD DETAILS'}
          </button>
          <button 
            onClick={() => onDelete(stay.id)}
            style={{ 
              padding: '0.4rem 0.75rem', 
              fontSize: '0.7rem', 
              fontWeight: 700, 
              borderRadius: '6px', 
              border: '1px solid rgba(239, 68, 68, 0.1)',
              background: 'rgba(239, 68, 68, 0.05)',
              color: '#ef4444',
              cursor: 'pointer'
            }}
          >
            DEL
          </button>
        </div>
      </div>

      {isEditing && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--glass-border)' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '0.5rem' }}>
            AUDIT EVIDENCE / TRIP NOTES
          </label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Flight LH-452, Hotel receipt link..."
            style={{ 
              width: '100%', 
              height: '80px', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: '1px solid var(--glass-border)',
              fontSize: '0.85rem',
              marginBottom: '0.75rem',
              resize: 'none'
            }}
          />
          <button 
            className="btn btn-primary btn-sm" 
            style={{ fontSize: '0.75rem' }}
            onClick={() => onUpdate(stay.id, { notes })}
          >
            Save Evidence
          </button>
        </div>
      )}
    </div>
  );
};

const History = () => {
  const { stays, loading, refreshData } = useTravel();
  const { token } = useAuth();

  const handleUpdateStay = async (id, data) => {
    try {
      await axios.patch(`http://localhost:5000/api/stays/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshData();
    } catch (error) {
      alert('Failed to update trip');
    }
  };

  const handleDeleteStay = async (id) => {
    if (!window.confirm('Delete this trip record?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/stays/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshData();
    } catch (error) {
      alert('Failed to delete trip');
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports/export', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `NomadTax_Audit_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Failed to generate report');
      console.error(error);
    }
  };

  if (loading && stays.length === 0) return <div className="loading-screen">Replaying your journey...</div>;

  const sortedStays = [...stays].sort((a, b) => new Date(b.arrivalDate) - new Date(a.arrivalDate));

  return (
    <Layout 
      title="Travel History" 
      subtitle="A granular record of your movements across borders."
    >

      <div className="history-grid">
        <div className="glass-card map-card" style={{ gridColumn: 'span 3', padding: '1.5rem', marginBottom: '2rem', height: '500px' }}>
          <MapChart stays={stays} />
        </div>

        <div style={{ gridColumn: 'span 3' }}>
          <div className="glass-card trip-feed-container" style={{ padding: '2rem' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0 }}>Chronological Sequence</h3>
              <button 
                onClick={handleDownloadReport}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', padding: '0.6rem 1.25rem' }}
              >
                <Download size={16} />
                GENERATE AUDIT PORTFOLIO
              </button>
            </div>
            
            <div className="trip-list">
              {sortedStays.map(stay => (
                <TripCard 
                  key={stay.id} 
                  stay={stay} 
                  onUpdate={handleUpdateStay} 
                  onDelete={handleDeleteStay} 
                />
              ))}
              {sortedStays.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>No travel records found in your database.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default History;
