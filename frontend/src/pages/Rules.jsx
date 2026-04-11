import React, { useState } from 'react';
import { Search, Globe, Landmark, BadgeAlert, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';

const COUNTRIES_MOCK = [
  { name: 'Portugal', code: 'PT', rule: '183-Day residency threshold. Digital Nomad Visa (D7/DR) available. NHR tax regime potential.', zone: 'Schengen' },
  { name: 'Thailand', code: 'TH', rule: 'LTR Visa for wealthy nomads. 180-day presence triggers tax residency on foreign income.', zone: 'ASEAN' },
  { name: 'Spain', code: 'ES', rule: 'Digital Nomad Visa includes 15% tax flat rate (Beckham Law). Part of Schengen 90/180.', zone: 'Schengen' },
  { name: 'Mexico', code: 'MX', rule: 'Temporary Residency up to 4 years. No tax on foreign income if remote.', zone: 'Latham' },
  { name: 'UAE', code: 'AE', rule: '0% Personal income tax. Digital Nomad Visa for 1 year, renewable.', zone: 'GCC' },
  { name: 'France', code: 'FR', rule: 'Strict 183-day rule. Part of Schengen. No specific Nomad visa yet.', zone: 'Schengen' },
  { name: 'United Kingdom', code: 'GB', rule: 'Statutory Residence Test (SRT) applies. 183-day rule. No specfic Nomad visa, but High Potential Individual available.', zone: 'Non-EU' },
  { name: 'Germany', code: 'DE', rule: 'Freiberufler (Freelance) Visa available. High tax burden but excellent infrastructure. Part of Schengen.', zone: 'Schengen' },
  { name: 'Italy', code: 'IT', rule: 'New Digital Nomad Visa launched in 2024. 70% tax reduction potential for relocated workers.', zone: 'Schengen' },
  { name: 'Greece', code: 'GR', rule: 'Digital Nomad Visa with 50% tax reduction for first 7 years. 183-day residency rule.', zone: 'Schengen' },
  { name: 'Indonesia', code: 'ID', rule: 'E33G Remote Worker Visa (Bali). 0% tax on foreign sourced income for 5 years.', zone: 'ASEAN' },
  { name: 'Malaysia', code: 'MY', rule: 'DE Rantau Pass for digital nomads. 0-15% tax on qualified local income.', zone: 'ASEAN' },
  { name: 'Georgia', code: 'GE', rule: 'Remotely from Georgia program. 1% tax for small businesses. 1-year visa-free for 95 countries.', zone: 'Non-EU' },
  { name: 'Croatia', code: 'HR', rule: 'Digital Nomad Residence Permit. 0% tax on foreign income for the duration of the permit.', zone: 'Schengen' },
  { name: 'Cyprus', code: 'CY', rule: 'Digital Nomad Visa with 50% tax reduction for high earners. 60-day rule for tax residency option.', zone: 'Non-EU' },
  { name: 'Japan', code: 'JP', rule: 'New Digital Nomad Visa (Specified Activities) for 6-month stays. 0% tax for non-residents. Requires 10M JPY annual income.', zone: 'East Asia' },
];

const Rules = () => {
  const [search, setSearch] = useState('');

  const filtered = COUNTRIES_MOCK.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.zone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout 
      title="Global Rules Intelligence" 
      subtitle="Real-time residency and tax thresholds for 150+ countries."
    >



      <div className="rules-grid">
        {filtered.map(country => (
          <div key={country.code} className="glass-card rule-card">
            <div className="rule-header">
              <div className="country-info">
                <h3>{country.name}</h3>
              </div>
              <span className={`zone-badge ${country.zone.toLowerCase()}`}>{country.zone}</span>
            </div>
            <p className="rule-text">{country.rule}</p>
            <div className="rule-footer">
              <button className="link-btn">Full Policy Analysis <ArrowRight size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .search-box {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
        }
        .search-box input {
          background: transparent;
          border: none;
          color: var(--text-main);
          width: 100%;
          outline: none;
          font-size: 1.1rem;
        }
        .rules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .rule-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .rule-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .country-info { display: flex; align-items: center; gap: 0.75rem; }
        .rule-text { color: var(--text-dim); font-size: 0.95rem; line-height: 1.6; }
        .zone-badge {
          padding: 0.25rem 0.6rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .zone-badge.schengen { background: #eff6ff; color: #3b82f6; border: 1px solid #dbeafe; }
        .zone-badge.asean { background: #fef2f2; color: #ef4444; border: 1px solid #fee2e2; }
        .link-btn {
          background: none;
          border: none;
          color: var(--primary);
          padding: 0;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }
      `}</style>
    </Layout>
  );
};

export default Rules;
