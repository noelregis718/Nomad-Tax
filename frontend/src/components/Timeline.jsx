import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Timeline = ({ stays = [], onAddClick }) => {
  // Aggregate data for the trend lines (Monthly)
  const monthlyData = [
    { name: 'Jan', intensity: 0, expenses: 0 },
    { name: 'Feb', intensity: 0, expenses: 0 },
    { name: 'Mar', intensity: 0, expenses: 0 },
    { name: 'Apr', intensity: 0, expenses: 0 },
    { name: 'May', intensity: 0, expenses: 0 },
    { name: 'Jun', intensity: 0, expenses: 0 },
    { name: 'Jul', intensity: 0, expenses: 0 },
    { name: 'Aug', intensity: 0, expenses: 0 },
    { name: 'Sep', intensity: 0, expenses: 0 },
    { name: 'Oct', intensity: 0, expenses: 0 },
    { name: 'Nov', intensity: 0, expenses: 0 },
    { name: 'Dec', intensity: 0, expenses: 0 },
  ];

  stays.forEach(stay => {
    const start = new Date(stay.arrivalDate);
    const end = new Date(stay.departureDate);
    const monthIndex = start.getMonth();
    
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    monthlyData[monthIndex].intensity += duration;
    monthlyData[monthIndex].expenses += (stay.expenses || 0);
  });

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>Travel Activity Timeline</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Combined residency & financial intelligence</p>
          </div>
          <button 
            onClick={onAddClick}
            className="add-record-btn"
            title="Log New Trip"
            style={{ fontSize: '0.75rem', fontWeight: 700, width: 'auto', padding: '0 0.8rem', height: '24px' }}
          >
            LOG TRIP
          </button>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
            <span>Days Abroad</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1e293b' }} />
            <span>Spend ($)</span>
          </div>
        </div>
      </div>

      {/* Top Part: The Intensity and Spend Curves (From Image) */}
      <div style={{ height: '220px', width: '100%', marginBottom: '0.5rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'var(--text-dim)' }} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} fontSize={10} hide />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} fontSize={10} hide />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.05)', strokeWidth: 1 }} />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="intensity" 
              stroke="var(--primary)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorIntensity)" 
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="expenses"
              stroke="#1e293b" 
              strokeWidth={3}
              fill="transparent"
              dot={{ r: 4, fill: '#1e293b', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#1e293b', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card" style={{ padding: '0.75rem 1rem', border: '1px solid var(--glass-border)', background: 'white' }}>
        <p style={{ fontWeight: 800, fontSize: '0.8rem', marginBottom: '0.4rem' }}>{label} 2024</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>{payload[0].value} Days Abroad</span>
          <span style={{ fontSize: '0.7rem', color: '#1e293b', fontWeight: 700 }}>${payload[1].value.toLocaleString()} Total Spend</span>
        </div>
      </div>
    );
  }
  return null;
};

export default Timeline;
