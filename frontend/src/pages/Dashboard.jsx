import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Info, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Timeline from '../components/Timeline';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [newStay, setNewStay] = useState({
    countryCode: '',
    countryName: '',
    arrivalDate: '',
    departureDate: '',
  });

  const [summaries, setSummaries] = useState([
    { countryCode: 'FR', countryName: 'France', daysUsed: 142, threshold: 183, status: 'safe' },
    { countryCode: 'SCH', countryName: 'Schengen Area', daysUsed: 78, threshold: 90, status: 'warning' },
    { countryCode: 'US', countryName: 'United States', daysUsed: 25, threshold: 183, status: 'safe' },
  ]);

  return (
    <div className="dashboard-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
      gridAutoRows: 'minmax(200px, auto)'
    }}>
      {/* 1. Main Status Card - Wide */}
      <div className="glass-card" style={{ gridColumn: 'span 2', padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="var(--primary)" />
          Residency Overview (2026)
        </h3>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaries}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="countryName" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-card)', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: 'white' }}
              />
              <Bar dataKey="daysUsed" radius={[4, 4, 0, 0]}>
                {summaries.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.daysUsed / entry.threshold > 0.8 ? 'var(--warning)' : 'var(--primary)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Schengen Alert Card */}
      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ 
          width: '80px', height: '80px', 
          borderRadius: '50%', 
          background: 'rgba(245, 158, 11, 0.1)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <AlertTriangle size={40} color="var(--warning)" />
        </div>
        <h3 style={{ color: 'var(--warning)', marginBottom: '8px' }}>Action Required</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          You have <strong>12 days</strong> remaining in the Schengen Area before violating the 90/180 rule.
        </p>
        <button style={{ marginTop: '1.5rem', padding: '8px 16px', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)', border: '1px solid var(--warning)' }}>
          Plan Exit Strategy
        </button>
      </div>

      {/* 3. Stats Small Cards */}
      <StatsCard label="Total Countries" value="12" sub="Across 3 continents" icon={<Globe size={20} />} />
      <StatsCard label="Travel Days" value="245" sub="67% of the year" icon={<Clock size={20} />} />
      <StatsCard label="Audit Readiness" value="100%" sub="All logs verified" icon={<Shield size={20} />} />
      
      {/* 4. Visual Timeline - Full Width */}
      <div style={{ gridColumn: 'span 3' }}>
        <Timeline />
      </div>

      {/* 5. Simple Modal (Absolute position for demo) */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="glass-card" style={{ padding: '2rem', width: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Add New Stay</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Country Name (e.g. France)" style={inputStyle} onChange={e => setNewStay({...newStay, countryName: e.target.value})} />
              <input type="text" placeholder="Country Code (e.g. FR)" style={inputStyle} onChange={e => setNewStay({...newStay, countryCode: e.target.value})} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="date" style={inputStyle} onChange={e => setNewStay({...newStay, arrivalDate: e.target.value})} />
                <input type="date" style={inputStyle} onChange={e => setNewStay({...newStay, departureDate: e.target.value})} />
              </div>
              <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowModal(false)}>Save Stay</button>
              <button style={{ background: 'transparent', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  padding: '12px',
  borderRadius: '8px',
  color: 'white',
  width: '100%'
};

const StatsCard = ({ label, value, sub, icon }) => (
  <div className="glass-card" style={{ padding: '1.5rem' }}>
    <div style={{ color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
      {label}
      {icon}
    </div>
    <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4px' }}>{value}</div>
    <div style={{ fontSize: '0.85rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
      <CheckCircle size={14} />
      {sub}
    </div>
  </div>
);

// Lucide icons needed for StatsCard but imported globally in Layout or here
import { Globe, Clock } from 'lucide-react';

export default Dashboard;
