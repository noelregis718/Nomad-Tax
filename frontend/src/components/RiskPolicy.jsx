import React from 'react';
import { motion } from 'framer-motion';

const RiskPolicy = ({ summaries = [], stays = [], selectedCountry = 'ALL' }) => {
  // Derive active data
  const activeSummary = selectedCountry === 'ALL' 
    ? { daysUsed: Math.max(...summaries.map(s => s.daysUsed), 0), threshold: 183, countryName: 'Global High' }
    : summaries.find(s => s.countryCode === selectedCountry);

  const schengen = summaries.find(s => s.countryCode === 'SCH') || { daysUsed: 0, threshold: 90 };
  const hasStays = stays.length > 0;
  
  // Logic helpers
  const isUSSelected = selectedCountry === 'USA' || (selectedCountry === 'ALL' && summaries.some(s => s.countryCode === 'USA'));
  const currentDays = activeSummary?.daysUsed || 0;
  const currentThreshold = activeSummary?.threshold || 183;

  const conditions = [
    {
      id: 'pe-nexus',
      label: 'PE Nexus Risk',
      status: hasStays && currentDays > 45 ? 'warning' : 'safe',
      value: hasStays && currentDays > 45 ? 'High (Stay > 45d)' : 'Low Exposure',
      desc: 'Risk of creating a taxable presence for your company.'
    },
    {
      id: 'residency-clock',
      label: `${selectedCountry === 'ALL' ? '183-Day' : activeSummary?.countryName} Clock`,
      status: hasStays && currentDays > (currentThreshold * 0.8) ? 'critical' : (hasStays && currentDays > (currentThreshold * 0.6) ? 'warning' : 'safe'),
      value: hasStays ? `${currentDays}/${currentThreshold} Days` : `0/${currentThreshold} Days`,
      desc: `Traditional residency threshold for ${selectedCountry === 'ALL' ? 'global' : activeSummary?.countryName} income tax.`
    },
    {
      id: 'audit-readiness',
      label: 'Audit Readiness',
      status: !hasStays || stays.length > 5 ? 'safe' : 'warning',
      value: stays.length > 5 ? '92% Score' : (hasStays ? '65% Score' : 'No Data'),
      desc: 'Defensibility of your travel records and evidence.'
    },
    {
      id: 'schengen-compliance',
      label: 'Schengen 90/180',
      status: hasStays && schengen.daysUsed > 85 ? 'critical' : (hasStays && schengen.daysUsed > 75 ? 'warning' : 'safe'),
      value: hasStays ? `${schengen.daysUsed}/90 Days` : '0/90 Days',
      desc: 'Rolling 180-day window for non-EU citizens.'
    },
    {
      id: 'dtaa-shield',
      label: 'DTAA Shield',
      status: 'safe',
      value: 'Active Treaty',
      desc: 'Availability of Double Tax Avoidance Agreements.'
    },
    {
      id: 'social-security',
      label: 'Social Security',
      status: hasStays && stays.length > 3 ? 'warning' : 'safe',
      value: hasStays && stays.length > 3 ? 'A1 Needed' : 'Verified',
      desc: 'Compliance with totalization and contribution laws.'
    },
    {
      id: 'substantial-presence',
      label: 'Substantial Presence',
      status: selectedCountry === 'USA' && activeSummary?.daysUsed > 182 ? 'critical' : 'safe',
      value: isUSSelected ? (selectedCountry === 'USA' ? 'Weighted Count' : 'US Active') : 'N/A',
      desc: 'US-specific rolling average residency test (Current + 1/3 Last + 1/6 Year Before).'
    },
    {
      id: 'exit-tax',
      label: 'Exit Tax Gauge',
      status: 'safe',
      value: 'No Trigger',
      desc: 'Potential tax on assets when shifting residency.'
    },
    {
      id: 'high-tax-dwell',
      label: 'High-Tax Dwell',
      status: hasStays && currentDays > 90 ? 'warning' : 'safe',
      value: hasStays && currentDays > 90 ? '22% Exposure' : 'Low',
      desc: 'Time spent in jurisdictions with >35% tax rates.'
    },
    {
      id: 'substance-level',
      label: 'Substance Level',
      status: hasStays && stays.length > 10 ? 'warning' : 'safe',
      value: 'Safe Zone',
      desc: 'Physical presence vs. remote economic activity.'
    }
  ];

  const criticalCount = conditions.filter(c => c.status === 'critical').length;
  const warningCount = conditions.filter(c => c.status === 'warning').length;

  return (
    <div className="risk-policy-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 className="card-title" style={{ margin: 0 }}>Risk Policy Profile</h3>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {criticalCount > 0 && <StatusBadge type="critical" count={criticalCount} />}
      </div>

      <div className="risk-grid">
        {conditions.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`risk-item ${item.status}`}
          >
            <div className="risk-content">
              <div className="risk-header">
                <span className="risk-label">{item.label}</span>
                <span className={`risk-status-dot ${item.status}`} />
              </div>
              <div className="risk-value">{item.value}</div>
            </div>
            <div className="risk-tooltip">
              <span>{item.desc}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .risk-policy-container {
          padding: 1.5rem;
        }
        .risk-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .risk-item {
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(0, 0, 0, 0.03);
          border-radius: 10px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
          transition: all 0.2s ease;
          cursor: help;
        }
        .risk-item:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          border-color: rgba(0,0,0,0.1);
        }

        .risk-content { flex: 1; }
        .risk-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          margin-bottom: 0.25rem;
        }
        .risk-label { font-size: 0.75rem; font-weight: 600; color: var(--text-dim); }
        .risk-value { font-size: 0.9rem; font-weight: 700; color: #1e293b; }
        
        .risk-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .risk-status-dot.critical { background: #ef4444; box-shadow: 0 0 8px rgba(239, 68, 68, 0.5); }
        .risk-status-dot.warning { background: #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.5); }
        .risk-status-dot.safe { background: var(--primary); box-shadow: 0 0 8px rgba(28, 167, 95, 0.5); }

        .risk-tooltip {
          position: absolute;
          right: 8px;
          top: 8px;
          color: var(--text-dim);
          opacity: 0.3;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .risk-item:hover .risk-tooltip { opacity: 0.8; }
        .risk-tooltip span { display: none; font-size: 10px; }

        .status-pill {
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .status-pill.critical { background: #fef2f2; color: #ef4444; border: 1px solid #fee2e2; }
        .status-pill.warning { background: #fffbeb; color: #f59e0b; border: 1px solid #fef3c7; }

        .country-risk-select {
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-main);
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          outline: none;
        }
        .country-risk-select:hover {
          background: white;
          border-color: rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

const StatusBadge = ({ type, count }) => {
  if (count === 0) return null;
  return (
    <div className={`status-pill ${type}`}>
      <span className="risk-status-dot" style={{ position: 'relative', boxShadow: 'none' }} />
      {count} {type.toUpperCase()}
    </div>
  );
};

export default RiskPolicy;
