import React, { useState, useEffect } from 'react';
import { Clock, Globe, Filter, Download, Newspaper, ExternalLink, Zap } from 'lucide-react';
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
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        if (!apiKey) return;
        
        const response = await axios.get(`https://newsdata.io/api/1/news?apikey=${apiKey}&q=digital%20nomad%20tax&language=en`);
        setNews(response.data.results.slice(0, 4));
      } catch (error) {
        console.error("News fetch failed:", error);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, []);

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
      title="Global Mobility Intelligence" 
      subtitle="Synthesizing your global footprint with real-time mobility analytics."
    >
      <div className="history-grid">
        <div className="glass-card map-card" style={{ gridColumn: 'span 3', padding: '1.5rem', marginBottom: '2.5rem', height: '550px' }}>
          <MapChart stays={stays} />
          <div className="map-overlay-btn">
            <button onClick={handleDownloadReport} className="btn-primary-glow">
              <Download size={16} /> DOWNLOAD AUDIT PORTFOLIO
            </button>
          </div>
        </div>

        {/* Global Mobility News Intelligence */}
        <div className="news-intelligence-section" style={{ gridColumn: 'span 3' }}>
          <div className="glass-card news-intelligence-card">
            <div className="section-header">
              <div className="title-row">
                <h3>News and Events</h3>
              </div>
            </div>

            <div className="news-grid">
              {newsLoading ? (
                <div className="news-loading">Scanning global tax updates...</div>
              ) : (
                news.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="news-card glass-card inner-card"
                  >
                    <div className="news-meta">
                      <span className="source">{item.source_id?.toUpperCase() || 'NEWS'}</span>
                      <span className="slash">/</span>
                      <span className="date">{new Date(item.pubDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                    </div>
                    <h4 className="news-title">{item.title}</h4>
                    <div className="news-footer">
                      <span className="read-more">Read Insight</span>
                      <ExternalLink size={12} />
                    </div>
                  </a>
                ))
              )}
              {!newsLoading && news.length === 0 && (
                <div className="news-empty">No high-priority tax updates found currently.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .history-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        
        .map-card { position: relative; }
        .map-overlay-btn { position: absolute; bottom: 2rem; right: 2rem; z-index: 10; }
        .btn-primary-glow { 
          display: flex; align-items: center; gap: 0.75rem; background: var(--primary); color: white; border: none; 
          padding: 0.85rem 1.5rem; border-radius: 12px; font-weight: 800; font-size: 0.8rem; cursor: pointer;
          box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4); transition: transform 0.2s;
        }
        .btn-primary-glow:hover { transform: translateY(-2px); }

        .news-intelligence-card { padding: 2.5rem; background: white !important; border: 1px solid #e2e8f0; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.25rem; }
        .title-row h3 { margin: 0; font-size: 1.35rem; font-weight: 800; color: #1e293b; }
        
        .live-indicator { 
          display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; font-weight: 800; 
          color: #16a34a; background: #f0fdf4; padding: 0.45rem 1rem; border-radius: 30px; 
        }
        .ping { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; display: block; animation: pulse 2s infinite; }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }

        .news-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
        .news-card.inner-card { 
          padding: 1.25rem; background: #f8fafc !important; border: 1.5px solid #f1f5f9; 
          min-height: 190px; box-shadow: none; display: flex; flex-direction: column; gap: 1rem; text-decoration: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .news-card.inner-card:hover { 
          background: white !important; border-color: var(--primary); 
          transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); 
        }
        
        .news-meta { display: flex; align-items: center; gap: 0.5rem; font-size: 0.65rem; font-weight: 800; color: #94a3b8; }
        .source { color: var(--primary); }
        .slash { font-weight: 300; }
        
        .news-title { margin: 0; font-size: 0.95rem; font-weight: 800; color: #1e293b; line-height: 1.4; flex: 1; }
        
        .news-footer { display: flex; align-items: center; gap: 0.4rem; color: var(--primary); margin-top: auto; }
        .read-more { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.025em; }

        .news-loading, .news-empty { 
          grid-column: span 4; text-align: center; padding: 4rem; background: rgba(255,255,255,0.3); 
          border-radius: 20px; border: 1.5px dashed #e2e8f0; font-weight: 700; color: #64748b;
        }
      `}</style>
    </Layout>
  );
};

export default History;
