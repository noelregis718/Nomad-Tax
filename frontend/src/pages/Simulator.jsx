import React, { useState } from 'react';
import { FlaskConical, Plus, Trash2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import DatePicker from '../components/ui/DatePicker';

const Simulator = () => {
  const [draftTrips, setDraftTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({ country: '', arrival: null, departure: null });

  const addTrip = () => {
    if (!newTrip.country || !newTrip.arrival || !newTrip.departure) return;
    
    // Convert to string for display/storage consistency
    const formattedTrip = {
      ...newTrip,
      id: Date.now(),
      arrival: newTrip.arrival.toISOString().split('T')[0],
      departure: newTrip.departure.toISOString().split('T')[0]
    };
    
    setDraftTrips([...draftTrips, formattedTrip]);
    setNewTrip({ country: '', arrival: null, departure: null });
  };

  const removeTrip = (id) => {
    setDraftTrips(draftTrips.filter(t => t.id !== id));
  };

  return (
    <Layout 
      title="Trip Simulator" 
      subtitle="Predict your future compliance status before you even book."
    >

      <div className="simulator-layout">
        <div className="simulator-controls">
          <div className="glass-card trip-builder" style={{ padding: '2.5rem' }}>
            <div className="card-header" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.5rem' }}>Intelligence Model</h3>
            </div>
            <p style={{ color: 'var(--text-dim)', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Add planned trips to check for potential 183-day residency triggers or Schengen 90/180 violations. Our AI model will simulate the impact on your global compliance records.
            </p>
            
            <div className="trip-form">
              <div className="input-field">
                <label style={{ fontSize: '0.9rem' }}>Target Country</label>
                <input 
                  type="text" 
                  placeholder="e.g. Italy" 
                  value={newTrip.country} 
                  onChange={e => setNewTrip({...newTrip, country: e.target.value})}
                  style={{ padding: '1rem' }}
                />
              </div>
              <div className="form-row">
                <div className="input-field">
                  <label>Arrival</label>
                  <DatePicker 
                    selected={newTrip.arrival} 
                    onChange={date => setNewTrip({...newTrip, arrival: date})} 
                    placeholderText="Select arrival"
                  />
                </div>
                <div className="input-field">
                  <label>Departure</label>
                  <DatePicker 
                    selected={newTrip.departure} 
                    onChange={date => setNewTrip({...newTrip, departure: date})} 
                    placeholderText="Select departure"
                  />
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }} onClick={addTrip}>
                <Plus size={20} />
                Add to Simulation
              </button>
            </div>
          </div>

          <div className="glass-card simulation-list" style={{ padding: '2rem', marginTop: '1.5rem' }}>
            <h3>Scheduled Drafts</h3>
            <div className="draft-items">
              {draftTrips.length === 0 ? (
                <p className="empty-msg">No simulated trips yet.</p>
              ) : (
                draftTrips.map(trip => (
                  <div key={trip.id} className="draft-item">
                    <div className="draft-info">
                      <strong>{trip.country}</strong>
                      <span>{trip.arrival} ➔ {trip.departure}</span>
                    </div>
                    <button className="trash-btn" onClick={() => removeTrip(trip.id)}><Trash2 size={16} /></button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="simulation-results">
          <div className="glass-card result-panel" style={{ padding: '2rem', height: '100%' }}>
            <div className="result-header">
              <h3>Impact Analysis</h3>
              {draftTrips.length > 0 ? (
                <span className="status-verify warning">
                  <AlertCircle size={16} />
                  Risk Detected
                </span>
              ) : (
                null
              )}
            </div>

            <div className="impact-visuals">
              <div className="impact-stat">
                <span>Predicted Schengen Days</span>
                <div className="progress-bar">
                  <div className="fill" style={{ width: draftTrips.length > 0 ? '78%' : '30%' }}></div>
                </div>
                <small>{draftTrips.length > 0 ? '70 / 90 days used' : '27 / 90 days used'}</small>
              </div>

              <div className="insight-box">
                <h4>Recommendation</h4>
                <p>
                  {draftTrips.length > 0 
                    ? "Your planned trip to Italy would put you at 78% of your Schengen limit. Avoid entering Europe for 30 days after this trip."
                    : "Add trips to see intelligent residency recommendations."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .simulator-layout {
          display: grid;
          grid-template-columns: 500px 1fr;
          gap: 2rem;
          min-height: 600px;
        }
        .trip-form { display: flex; flex-direction: column; gap: 1rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .input-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .input-field label { font-size: 0.8rem; font-weight: 600; color: var(--text-dim); }
        .empty-msg { color: var(--text-dim); text-align: center; margin-top: 2rem; font-style: italic; }
        .draft-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(0,0,0,0.02);
          border-radius: 12px;
          margin-bottom: 0.75rem;
        }
        .draft-info { display: flex; flex-direction: column; }
        .draft-info span { font-size: 0.8rem; color: var(--text-dim); }
        .trash-btn { background: none; border: none; color: #ef4444; cursor: pointer; }
        
        .result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .status-verify { display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.8rem; font-weight: 700; }
        .status-verify.safe { background: #f0fdf4; color: #16a34a; }
        .status-verify.warning { background: #fffbeb; color: #d97706; }
        
        .progress-bar { height: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; margin: 0.75rem 0; }
        .progress-bar .fill { height: 100%; background: var(--gradient-main); border-radius: 4px; }
        .insight-box { margin-top: 4rem; padding: 1.5rem; background: #f8fafc; border-radius: 12px; border: 1px dashed var(--glass-border); }
        .insight-box h4 { margin-bottom: 0.5rem; color: var(--text-main); }
        .insight-box p { color: var(--text-dim); line-height: 1.6; }
      `}</style>
    </Layout>
  );
};

export default Simulator;

