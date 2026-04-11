import React from 'react';
import { motion } from 'framer-motion';

const Timeline = ({ stays }) => {
  // Mock data if none provided
  const travelStays = stays || [
    { id: 1, country: 'France', start: '2026-01-10', end: '2026-02-15', color: '#6366f1' },
    { id: 2, country: 'Italy', start: '2026-02-16', end: '2026-03-20', color: '#a855f7' },
    { id: 3, country: 'Spain', start: '2026-04-05', end: '2026-05-10', color: '#ec4899' },
  ];

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <h3 style={{ marginBottom: '2rem' }}>Travel Timeline</h3>
      <div style={{ position: 'relative', height: '100px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
        {/* Months labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', color: 'var(--text-muted)', fontSize: '0.75rem', position: 'absolute', width: '100%', top: '5px' }}>
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>

        {/* Timeline Bars */}
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
          {travelStays.map((stay, index) => {
            const startDay = getDayOfYear(new Date(stay.start));
            const endDay = getDayOfYear(new Date(stay.end));
            const left = (startDay / 365) * 100;
            const width = ((endDay - startDay) / 365) * 100;

            return (
              <motion.div
                key={stay.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  width: `${width}%`,
                  height: '40px',
                  background: stay.color,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}
              >
                {stay.country}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper to get day of year (1-365)
const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export default Timeline;
