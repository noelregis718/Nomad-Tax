import React, { useState, useEffect } from 'react';
import { Map, Clock, Globe, Filter, Download } from 'lucide-react';
import Layout from '../components/Layout';
import Timeline from '../components/Timeline';
import axios from 'axios';

const History = () => {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStays = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/stays');
        setStays(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchStays();
  }, []);

  if (loading) return <div className="loading-screen">Replaying your journey...</div>;

  return (
    <Layout 
      title="Travel History" 
      subtitle="A granular record of your movements across borders."
    >

      <div className="history-grid">
        {/* Map Visualization (Mock) */}
        <div className="glass-card map-card" style={{ gridColumn: 'span 3', padding: '1.5rem', marginBottom: '2rem' }}>
          <div className="map-placeholder">
            <Globe size={48} className="text-dim" />
            <p>Interactive Map View (Beta)</p>
            <span className="badge-light">3 Continents Visited</span>
          </div>
        </div>

        {/* Detailed Timeline */}
        <div style={{ gridColumn: 'span 3' }}>
          <div className="glass-card timeline-expanded-card" style={{ padding: '2rem' }}>
            <div className="card-header">
              <Clock size={20} className="text-blue" />
              <h3>Chronological Sequence</h3>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <Timeline stays={stays} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.5rem;
        }
        .header-actions {
          display: flex;
          gap: 1rem;
        }
        .map-placeholder {
          height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.02);
          border-radius: 1rem;
          gap: 1rem;
          color: var(--text-dim);
        }
        .badge-light {
          padding: 0.25rem 0.75rem;
          background: white;
          border: 1px solid var(--glass-border);
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .section-title { font-size: 2rem; font-weight: 800; }
        .card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
      `}</style>
    </Layout>
  );
};

export default History;
