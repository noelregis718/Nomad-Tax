import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Timeline from '../components/Timeline';
import { useTravel } from '../context/TravelContext';
import DatePicker from '../components/ui/DatePicker';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const { stays, summaries, loading, refreshData } = useTravel();
  const [newStay, setNewStay] = useState({
    countryCode: '',
    countryName: '',
    arrivalDate: null, // Changed to null for DatePicker
    departureDate: null, // Changed to null for DatePicker
    notes: ''
  });

  const handleAddStay = async () => {
    try {
      // Format dates back to string for API
      const payload = {
        ...newStay,
        arrivalDate: newStay.arrivalDate?.toISOString().split('T')[0],
        departureDate: newStay.departureDate?.toISOString().split('T')[0]
      };
      await axios.post('http://localhost:5000/api/stays', payload);
      setShowModal(false);
      await refreshData();
      // Reset state
      setNewStay({ countryCode: '', countryName: '', arrivalDate: null, departureDate: null, notes: '' });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add stay');
    }
  };

  if (loading && stays.length === 0) return <div className="loading-screen">Aligning global coordinates...</div>;

  return (
    <Layout onAddClick={() => setShowModal(true)}>
      <div className="dashboard-grid">
        {/* Main Chart */}
        <div className="glass-card chart-container" style={{ gridColumn: 'span 2', padding: '2rem' }}>
          <h3 className="card-title">
            Residency Compliance Overview
          </h3>
          <div style={{ height: '300px', width: '100%', marginTop: '2rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaries}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="countryName" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ background: '#1e293b', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                />
                <Bar dataKey="daysUsed" barSize={60} radius={[8, 8, 0, 0]}>
                  {summaries.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.daysUsed / entry.threshold > 0.8 ? '#f59e0b' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Card */}
        <div className="glass-card alert-card">
          <h3>Policy Alert</h3>
          <p>
            You are approaching the <strong>90-day limit</strong> in the Schengen Zone. 
            Consider planning your next exit by May 14th.
          </p>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
            View Detailed Rules
          </button>
        </div>

        {/* Stats Row */}
        <StatsCard label="Total Stays" value={stays.length} sub="Verified records" />
        <StatsCard label="Active Zone" value="Europe" sub="Current location" />
        <StatsCard label="Compliance Score" value="98%" sub="Audit-ready" />

        {/* Timeline */}
        <div style={{ gridColumn: 'span 3' }}>
          <Timeline stays={stays} />
        </div>
      </div>

      {/* Add Stay Modal */}
      {showModal && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card modal-content"
          >
            <h3>Record New Travel</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>Country Name</label>
                <input type="text" placeholder="e.g. Portugal" onChange={e => setNewStay({...newStay, countryName: e.target.value})} />
              </div>
              <div className="input-group">
                <label>ISO Code</label>
                <input type="text" placeholder="e.g. PT" onChange={e => setNewStay({...newStay, countryCode: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Arrival Date</label>
                <DatePicker 
                  selected={newStay.arrivalDate} 
                  onChange={date => setNewStay({...newStay, arrivalDate: date})} 
                  placeholderText="Select arrival"
                />
              </div>
              <div className="input-group">
                <label>Departure Date</label>
                <DatePicker 
                  selected={newStay.departureDate} 
                  onChange={date => setNewStay({...newStay, departureDate: date})} 
                  placeholderText="Select departure"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleAddStay}>Save Record</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

const StatsCard = ({ label, value, sub, icon }) => (
  <div className="glass-card stats-card">
    <div className="stats-header">
      <span className="stats-label">{label}</span>
    </div>
    <div className="stats-value">{value}</div>
    <div className="stats-footer">
      <span>{sub}</span>
    </div>
  </div>
);

export default Dashboard;
