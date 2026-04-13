import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Shield, AlertCircle, Info, Plus } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Timeline from '../components/Timeline';
import RiskPolicy from '../components/RiskPolicy';
import { useTravel } from '../context/TravelContext';
import { useAuth } from '../context/AuthContext';
import DatePicker from '../components/ui/DatePicker';

const Dashboard = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { token } = useAuth();
  const { stays, summaries, loading, refreshData } = useTravel();
  const [newStay, setNewStay] = useState({
    countryCode: '',
    countryName: '',
    city: '',
    category: 'Personal',
    expenses: '',
    currency: 'USD',
    arrivalDate: null,
    departureDate: null,
    notes: ''
  });

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' },
    { code: 'AUD', symbol: 'A$' },
    { code: 'CAD', symbol: 'C$' },
    { code: 'CHF', symbol: 'Fr' },
    { code: 'CNY', symbol: '¥' },
    { code: 'HKD', symbol: 'HK$' },
    { code: 'SGD', symbol: 'S$' },
  ];

  const handleAddStay = async () => {
    try {
      // Format dates back to string for API
      const payload = {
        ...newStay,
        arrivalDate: newStay.arrivalDate?.toISOString().split('T')[0],
        departureDate: newStay.departureDate?.toISOString().split('T')[0]
      };
      await axios.post('http://localhost:5000/api/stays', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      await refreshData();
      // Reset state
      setNewStay({ countryCode: '', countryName: '', city: '', category: 'Personal', expenses: '', currency: 'USD', arrivalDate: null, departureDate: null, notes: '' });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add stay');
    }
  };

  // --- KPI Calculations ---
  const hasStays = stays.length > 0;
  
  // 1. Global Exposure (Total days outside home/sum of all stays)
  const totalDaysOut = Array.isArray(summaries) 
    ? summaries.filter(s => s.countryCode !== 'SCH').reduce((acc, s) => acc + s.daysUsed, 0) 
    : 0;

  // 2. Next Critical Exit (Closest threshold crossing)
  let nextExit = { country: null, days: null };
  if (hasStays && summaries.length > 0) {
    const sortedRisks = [...summaries].sort((a, b) => (a.threshold - a.daysUsed) - (b.threshold - b.daysUsed));
    nextExit = { 
      country: sortedRisks[0].countryName, 
      days: sortedRisks[0].threshold - sortedRisks[0].daysUsed 
    };
  }

  // 3. Audit Readiness (% of stays with evidence/notes)
  const documentedCount = stays.filter(s => s.notes && s.notes.trim() !== '').length;
  const auditScore = hasStays ? Math.round((documentedCount / stays.length) * 100) : null;

  // 4. Total Spend
  const totalSpend = stays.reduce((acc, s) => acc + (s.expenses || 0), 0);

  // 5. Risk Summary (Used for top KPI)
  const criticalCount = Array.isArray(summaries) ? summaries.filter(s => s.daysUsed / s.threshold > 1).length : 0;
  const warningCount = Array.isArray(summaries) ? summaries.filter(s => {
    const ratio = s.daysUsed / s.threshold;
    return ratio > 0.8 && ratio <= 1;
  }).length : 0;

  if (loading && stays.length === 0) return <div className="loading-screen">Aligning global coordinates...</div>;

  return (
    <Layout onAddClick={() => setShowModal(true)}>
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {/* Row 1: 4 Main KPIs */}
        <StatsCard 
          label="Risk Profile" 
          value={criticalCount > 0 ? "CRITICAL" : "SAFE"} 
          sub={criticalCount > 0 ? `${criticalCount} critical triggers` : "No urgent risks"} 
          status={criticalCount > 0 ? 'critical' : 'safe'}
        />
        <StatsCard 
          label="Global Exposure" 
          value={hasStays ? `${totalDaysOut} Days` : "--"} 
          sub={hasStays ? "Total travel time" : "Collecting data"} 
        />
        <StatsCard 
          label="Next Critical Exit" 
          value={nextExit.country ? `${nextExit.country}: ${nextExit.days}d` : "--"} 
          sub={nextExit.country ? "Closest threshold" : "No active risks"} 
          status={nextExit.days < 15 ? 'warning' : 'safe'}
        />
        <StatsCard 
          label="Audit Readiness" 
          value={auditScore !== null ? `${auditScore}%` : "--"} 
          sub="Evidence documented" 
          status={auditScore < 100 ? 'warning' : 'safe'}
        />

        {/* Row 2: Analysis (Side-by-Side) */}
        <div className="glass-card chart-container" style={{ gridColumn: 'span 3', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h3 className="card-title" style={{ margin: 0 }}>
                Residency Compliance Overview {selectedCountry && `(${selectedCountry})`}
              </h3>
              <button 
                onClick={() => setShowModal(true)}
                className="add-record-btn"
                title="Add Travel Record"
                style={{ fontSize: '0.75rem', fontWeight: 700, width: 'auto', padding: '0 0.5rem' }}
              >
                ADD
              </button>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
              {selectedCountry && (
                <button 
                  onClick={() => setSelectedCountry(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 800 }}
                >
                  RESET VIEW
                </button>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--primary)' }} />
                <span>Used</span>
              </div>
            </div>
          </div>
          
          <div style={{ height: '400px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={Array.isArray(summaries) ? summaries : []} 
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                onClick={(data) => {
                  if (data && data.activePayload && data.activePayload[0]) {
                    setSelectedCountry(data.activePayload[0].payload.countryCode);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="countryName" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Days', angle: -90, position: 'insideLeft', offset: 10, fill: 'var(--text-dim)', fontSize: 10 }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)', cursor: 'pointer' }} content={<CustomTooltip />} />
                <Bar 
                  dataKey="threshold" 
                  fill="rgba(0,0,0,0.05)" 
                  barSize={45} 
                  radius={[6, 6, 0, 0]} 
                  isAnimationActive={false} 
                  style={{ cursor: 'pointer' }}
                />
                <Bar 
                  dataKey="daysUsed" 
                  barSize={45} 
                  radius={[6, 6, 0, 0]} 
                  style={{ marginTop: '-45px', cursor: 'pointer' }}
                >
                  {Array.isArray(summaries) && summaries.map((entry, index) => {
                    const isSelected = selectedCountry === entry.countryCode;
                    const ratio = entry.daysUsed / entry.threshold;
                    let color = isSelected ? 'var(--secondary)' : 'var(--primary)';
                    if (!isSelected) {
                      if (ratio > 1) color = '#ef4444';
                      else if (ratio > 0.8) color = '#f59e0b';
                    }
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Syncronized Risk Policy beside Compliance Chart */}
        <div className="glass-card risk-profile-card" style={{ padding: 0, gridColumn: '4' }}>
          <RiskPolicy summaries={summaries} stays={stays} selectedCountry={selectedCountry || 'ALL'} />
        </div>

        {/* Travel Timeline & Finance (Full Width) */}
        <div style={{ gridColumn: 'span 4' }}>
          <Timeline stays={stays} onAddClick={() => setShowModal(true)} />
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
                <input type="text" placeholder="e.g. Portugal" value={newStay.countryName} onChange={e => setNewStay({...newStay, countryName: e.target.value})} />
              </div>
              <div className="input-group">
                <label>ISO Code</label>
                <input type="text" placeholder="e.g. PT" value={newStay.countryCode} onChange={e => setNewStay({...newStay, countryCode: e.target.value})} />
              </div>
              <div className="input-group">
                <label>City / Region</label>
                <input type="text" placeholder="e.g. Lisbon" value={newStay.city} onChange={e => setNewStay({...newStay, city: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select className="custom-select" value={newStay.category} onChange={e => setNewStay({...newStay, category: e.target.value})}>
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Transit">Transit</option>
                  <option value="Medical">Medical</option>
                </select>
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
              <div className="input-group">
                <label>Est. Expenses</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div className="currency-picker-container">
                    <div 
                      className="currency-trigger" 
                      onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                    >
                      <span>{newStay.currency}</span>
                      <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>▼</span>
                    </div>

                    {isCurrencyOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="currency-dropdown"
                      >
                        {currencies.map(c => (
                          <div 
                            key={c.code}
                            className={`currency-option ${newStay.currency === c.code ? 'selected' : ''}`}
                            onClick={() => {
                              setNewStay({...newStay, currency: c.code});
                              setIsCurrencyOpen(false);
                            }}
                          >
                            <span className="currency-symbol">{c.symbol}</span>
                            <span className="currency-code">{c.code}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                  <input type="number" placeholder="0.00" style={{ flex: 1 }} value={newStay.expenses} onChange={e => setNewStay({...newStay, expenses: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label>Activity Notes / Evidence Link</label>
                <input type="text" placeholder="e.g. Flight LH-452" value={newStay.notes} onChange={e => setNewStay({...newStay, notes: e.target.value})} />
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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const ratio = data.daysUsed / data.threshold;
    let statusText = "Safe Access";
    let statusColor = "var(--primary)";
    
    if (ratio > 1) {
      statusText = "Limit Exceeded";
      statusColor = "#ef4444";
    } else if (ratio > 0.8) {
      statusText = "Action Required";
      statusColor = "#f59e0b";
    }

    return (
      <div className="glass-card" style={{ padding: '1rem', border: `1px solid ${statusColor}`, background: 'rgba(255,255,255,0.95)' }}>
        <p style={{ fontWeight: 800, marginBottom: '0.25rem', color: '#1e293b' }}>{data.countryName}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>Residency Window Profile</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Days Used:</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>{data.daysUsed} / {data.threshold}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Remaining:</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: statusColor }}>{Math.max(0, data.threshold - data.daysUsed)} days</span>
          </div>
        </div>
        
        <div style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: statusColor, textTransform: 'uppercase' }}>{statusText}</span>
        </div>
      </div>
    );
  }
  return null;
};

const StatsCard = ({ label, value, sub, status }) => (
  <div className="glass-card stats-card">
    <div className="stats-header">
      <span className="stats-label">{label}</span>
    </div>
    <div className="stats-value">{value}</div>
    <div className="stats-footer" style={{ color: status === 'critical' ? '#ef4444' : (status === 'warning' ? '#f59e0b' : '#22c55e') }}>
      <span style={{ fontWeight: (status === 'critical' || status === 'warning') ? 700 : 500 }}>{sub}</span>
    </div>
  </div>
);

export default Dashboard;
