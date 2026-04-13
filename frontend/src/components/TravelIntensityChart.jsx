import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TravelIntensityChart = ({ stays = [] }) => {
  // Aggregate stays by month for intensity AND expenses
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
    <div className="glass-card intensity-card" style={{ padding: '2rem', height: '400px' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 className="card-title" style={{ margin: 0 }}>Presence vs. Spend Profile</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Dual-axis financial & residency intelligence</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
            {stays.length > 0 ? 'Active' : 'N/A'}
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Fiscal 2024</div>
        </div>
      </div>

      <div style={{ height: '260px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={monthlyData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              fontSize={11} 
              tick={{ fill: 'var(--text-dim)' }}
              dy={10}
            />
            {/* Intensity Axis */}
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              fontSize={11} 
              tick={{ fill: 'var(--text-dim)' }} 
            />
            {/* Expense Axis (Hidden but used for scaling) */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false} 
              tickLine={false} 
              fontSize={11} 
              tick={{ fill: 'var(--text-dim)' }}
              hide
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }} />
            
            {/* Intensity Area */}
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="intensity" 
              stroke="var(--primary)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorIntensity)" 
              isAnimationActive={true}
            />
            
            {/* Expense Line - Matching the style of your provided image */}
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="expenses"
              stroke="#1e293b" // Dark line like the image
              strokeWidth={3}
              fill="transparent"
              dot={{ r: 4, fill: '#1e293b', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#1e293b', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--primary)', opacity: 0.3 }} />
          <span style={{ color: 'var(--text-dim)' }}>Presence Density (Days)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: '#1e293b' }} />
          <span style={{ color: 'var(--text-dim)' }}>Travel Spend ($)</span>
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card" style={{ padding: '0.85rem 1.15rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.98)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <p style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem', color: '#1e293b' }}>{label} 2024</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)' }}>Days Abroad</span>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{payload[0].value}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1e293b' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)' }}>Trip Spend</span>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>${payload[1].value.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default TravelIntensityChart;
