import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';
import Layout from '../components/Layout';
import Timeline from '../components/Timeline';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [stays, setStays] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStay, setNewStay] = useState({
    countryCode: '',
    countryName: '',
    arrivalDate: '',
    departureDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [staysRes, summaryRes] = await Promise.all([
        axios.get('http://localhost:5000/api/stays'),
        axios.get('http://localhost:5000/api/summary/SCH') // Default to Schengen for overview
      ]);
      setStays(staysRes.data);
      // For demo, we'll create a list of summaries. In a real app, 
      // you'd fetch multiple or the backend would return an array.
      setSummaries([
        { countryName: 'Schengen Area', ...summaryRes.data }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleAddStay = async () => {
    try {
      await axios.post('http://localhost:5000/api/stays', newStay);
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add stay');
    }
  };

  if (loading) return <div className="loading-screen">Aligning global coordinates...</div>;

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
                  contentStyle={{ background: '#1e293b', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
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
        <div style={{ gridColumn: 'span 3', marginTop: '1rem' }}>
          <h3 className="section-subtitle">Visual Travel Timeline</h3>
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
                <input type="date" onChange={e => setNewStay({...newStay, arrivalDate: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Departure Date</label>
                <input type="date" onChange={e => setNewStay({...newStay, departureDate: e.target.value})} />
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
