import React, { useState, useMemo } from 'react';
import { FlaskConical, TrendingUp, ShieldCheck, AlertCircle, Calendar, Landmark, Info, ArrowRight, Wallet, CheckCircle2, FileText } from 'lucide-react';
import Layout from '../components/Layout';

const STRATEGIES_MOCK = [
  {
    id: 'dubai',
    name: 'The Dubai Loop',
    region: 'UAE',
    taxRate: '0%',
    visaCost: '₹25,000',
    compliance: 'Low',
    pppIndex: 1.4,
    dtaaStatus: 'Active support (Article 13(4))',
    remittanceRoute: 'Optimized via Gift/LRS',
    description: '0% Income tax for remote workers on the Dubai Remote Work visa. The gold standard for absolute tax freedom.',
    auditChecklist: [
      'Emirates ID copy & PIN', 
      'Ejari verified rental contract', 
      'Monthly foreign salary slips',
      'Original Boarding Passes (Proof of Stay)',
      'UAE Bank Account Statements (showing local spends)'
    ]
  },
  {
    id: 'portugal',
    name: 'Portugal NHR Path',
    region: 'EU / Schengen',
    taxRate: '20% (NHR)',
    visaCost: '₹16,200',
    compliance: 'Medium',
    pppIndex: 1.1,
    dtaaStatus: 'Active Support (Full Treaty)',
    remittanceRoute: 'Optimized via NRE/NRO Flow',
    description: 'Special 20% flat rate for high-value activities. Path to EU citizenship after 5 years.',
    auditChecklist: [
      'NIF (Portuguese Tax Number) docs', 
      'SNS public health number', 
      'EU standard rental agreement',
      'Passport stamps for Schengen entry/exit',
      'Local utility bills (Proof of address)'
    ]
  },
  {
    id: 'bali',
    name: 'ASEAN High-Savings',
    region: 'Indonesia',
    taxRate: '0% (Foreign Inc)',
    visaCost: '₹12,000',
    compliance: 'Low',
    pppIndex: 1.8,
    dtaaStatus: 'Active Support (Exemptions)',
    remittanceRoute: 'Optimized via SWIFT/LRS',
    description: 'No tax on foreign-sourced income. Highest personal savings rate due to low local living costs.',
    auditChecklist: [
      'KITAS or B211A Nomad Visa logs', 
      'Foreign bank source statements', 
      'Proof of accommodation (E-receipts)',
      'Immigration entry/exit stamps',
      'Monthly income vs spend reconciliation'
    ]
  },
  {
    id: 'mauritius',
    name: 'Mauritius Premium',
    region: 'Mauritius',
    taxRate: '0% (Nomad)',
    visaCost: '₹0',
    compliance: 'Low',
    pppIndex: 1.3,
    dtaaStatus: 'Active Support (Strong)',
    remittanceRoute: 'Optimized via Personal Remittance',
    description: 'The Premium Visa allows stays up to 1 year with 0% tax on foreign income. A rising favorite for Indian entrepreneurs.',
    auditChecklist: [
      'MRA (Tax Authority) registration',
      'Certificate of Entry (Home Affairs)', 
      'Monthly bank statements (6 months)', 
      'Comprehensive health insurance policy',
      'Proof of onward travel (Flight logs)'
    ]
  },
  {
    id: 'spain',
    name: 'Spain Beckham Law',
    region: 'Spain',
    taxRate: '15%',
    visaCost: '₹12,600',
    compliance: 'Medium',
    pppIndex: 1.0,
    dtaaStatus: 'Active Support (Full)',
    remittanceRoute: 'Optimized via Article 24',
    description: 'Digital Nomad Visa paired with the Beckham Law for a 15% flat tax rate on the first ₹5.4 Crores.',
    auditChecklist: [
      'TIE (Foreigner Identity Card)',
      'Empadronamiento registration', 
      'Beckham Law approval (Form 149)', 
      'Spain Social Security registration',
      'Remote work contract (Apostilled)'
    ]
  },
  {
    id: 'singapore',
    name: 'Singapore PEP Hub',
    region: 'Singapore',
    taxRate: '15%',
    visaCost: '₹20,600',
    compliance: 'High',
    pppIndex: 1.2,
    dtaaStatus: 'Active Support (Comprehensive)',
    remittanceRoute: 'Optimized via Double Tax Relief',
    description: 'Tiered tax system from 0% to 22%. Ideal for founders and high-income professionals with global partnerships.',
    auditChecklist: [
      'FIN card digital record', 
      'IRAS annual tax assessments', 
      'Professional Pass (PEP) renewal logs',
      'Form IR21 (Tax Clearance) logs',
      'CPF exemption certificate (if applicable)'
    ]
  },
  {
    id: 'india',
    name: 'India Base (ROR)',
    region: 'Domestic',
    taxRate: '5-30%',
    visaCost: '₹0',
    compliance: 'High Risk',
    pppIndex: 1.0,
    dtaaStatus: 'N/A (Domestic)',
    remittanceRoute: 'Domestic GST/TDS Flow',
    description: 'Standard residency. Full taxation on global income. Risk of scrutiny on high-value remittances.',
    auditChecklist: [
      'Form 16 & 26AS reconciliation', 
      'SFT (High Value Transaction) log', 
      'Foreign Asset (FA) schedule filing',
      'FIRC (Remittance Certificate) records',
      'PAN-Aadhaar verification status'
    ]
  }
];

const Wealth = () => {
  const [income, setIncome] = useState(5000000); // Default 50L
  const [activeStrategy, setActiveStrategy] = useState(STRATEGIES_MOCK[0]);

  // Advanced Tax Logic (New Regime FY 2024-25)
  const calculateIndiaTax = (inc) => {
    let tax = 0;
    if (inc <= 300000) tax = 0;
    else if (inc <= 600000) tax = (inc - 300000) * 0.05;
    else if (inc <= 900000) tax = 15000 + (inc - 600000) * 0.1;
    else if (inc <= 1200000) tax = 45000 + (inc - 900000) * 0.15;
    else if (inc <= 1500000) tax = 90000 + (inc - 1200000) * 0.2;
    else tax = 150000 + (inc - 1500000) * 0.3;

    // Surcharges (New Regime Cap)
    let surcharge = 0;
    if (inc > 50000000) surcharge = tax * 0.25; 
    else if (inc > 20000000) surcharge = tax * 0.25;
    else if (inc > 10000000) surcharge = tax * 0.15;
    else if (inc > 5000000) surcharge = tax * 0.10;

    const cess = (tax + surcharge) * 0.04;
    return tax + surcharge + cess;
  };

  const indiaTax = useMemo(() => calculateIndiaTax(income), [income]);

  const strategyTax = useMemo(() => {
    const rate = parseInt(activeStrategy.taxRate) || 0;
    return income * (rate / 100);
  }, [income, activeStrategy]);

  return (
    <Layout 
      title="Wealth Intelligence" 
      subtitle="Data-driven strategy to optimize your global financial trajectory."
    >
      <div className="wealth-strategy-layout">
        <div className="control-panel glass-card">
          <div className="income-slider-section">
            <div className="label-row">
              <label>Annual Income (INR)</label>
              <span className="amount">
                {income >= 10000000 
                  ? `₹${(income / 10000000).toFixed(2)} Cr` 
                  : `₹${(income / 100000).toFixed(1)} Lakhs`}
              </span>
            </div>
            <input 
              type="range" 
              min="250000" 
              max="100000000" 
              step="250000" 
              value={income} 
              onChange={(e) => setIncome(parseInt(e.target.value))}
              className="strategy-slider"
            />
            <p className="slider-hint">Explore savings potential from entry-level up to ₹10 Crore earners.</p>
          </div>

          <div className="strategy-selector">
            <label>Choose Strategy Path</label>
            <div className="strategy-grid">
              {STRATEGIES_MOCK.map(s => (
                <button 
                  key={s.id}
                  className={`strategy-btn ${activeStrategy.id === s.id ? 'active' : ''}`}
                  onClick={() => setActiveStrategy(s)}
                >
                  <div className="btn-content">
                    <span className="name">{s.name}</span>
                    <span className="meta">{s.region} • {s.taxRate}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="intelligence-grid">
          {/* Main ROI Card */}
          <div className="data-card main-roi glass-card">
            <div className="card-header">
              <h3>Strategy Impact Analysis</h3>
              <div className="roi-badge">ROI: {(activeStrategy.pppIndex * 100).toFixed(0)}%</div>
            </div>
            
            <div className="roi-stats">
              <div className="roi-stat">
                <span className="label">Tax Savings (vs India)</span>
                <span className="val highlight">₹{Math.max(0, (indiaTax - (income * (parseInt(activeStrategy.taxRate) || 0) / 100))).toLocaleString('en-IN')}</span>
              </div>
              <div className="roi-stat">
                <span className="label">Purchasing Power (PPP)</span>
                <span className="val">{activeStrategy.pppIndex}x vs India</span>
              </div>
              <div className="roi-stat">
                <span className="label">Compliance Load</span>
                <span className="val">{activeStrategy.compliance}</span>
              </div>
            </div>

            <div className="strategy-desc">
              <p>{activeStrategy.description}</p>
            </div>
          </div>

          {/* Financial Exposure Matrix - DYNAMIC BY COUNTRY */}
          <div className="data-card tax-intelligence-iq glass-card">
            <div className="card-header">
              <h3>{activeStrategy.name} Exposure</h3>
            </div>

            <div className="calculator-content">
              <div className="calc-view">
                <div className="iq-result-main">
                  <span className="label">Projected {activeStrategy.region} Liability</span>
                  <span className="value">₹{(strategyTax + (parseInt(activeStrategy.visaCost.replace(/[^\d]/g, '')) || 0)).toLocaleString('en-IN')}</span>
                </div>
                
                <div className="iq-breakdown">
                  <div className="iq-row">
                    <span>{activeStrategy.region} Income Tax ({activeStrategy.taxRate})</span>
                    <span className={strategyTax > 0 ? 'text-red' : 'text-green'}>₹{strategyTax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="iq-row">
                    <span>Visa & Administrative Overhead</span>
                    <span className="text-dim">{activeStrategy.visaCost}</span>
                  </div>
                  <div className="iq-divider"></div>
                  <div className="iq-row total-savings">
                    <span>Annual Net Advantage</span>
                    <div className="savings-chips">
                      <span className="text-blue">₹{Math.max(0, (indiaTax - strategyTax)).toLocaleString('en-IN')} Saved</span>
                    </div>
                  </div>
                  <p className="simple-hint">Your Indian liability would have been ₹{(indiaTax).toLocaleString('en-IN')}.</p>
                </div>
              </div>
            </div>
          </div>

          {/* DTAA & Audit Card */}
          <div className="data-card dtaa-intelligence glass-card">
            <div className="card-header">
              <h3>Compliance Intelligence</h3>
            </div>
            <div className="dtaa-status">
              <div className="status-row">
                <span>DTAA with India</span>
                <span className="text-green" style={{ fontWeight: 700 }}>
                  {activeStrategy.dtaaStatus}
                </span>
              </div>
              <div className="status-row">
                <span>Remittance Route</span>
                <span className="text-main" style={{ fontWeight: 700 }}>
                  {activeStrategy.remittanceRoute}
                </span>
              </div>
            </div>
            <div className="audit-preview">
              <label>Essential Audit Evidence</label>
              <ul>
                {activeStrategy.auditChecklist.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .wealth-strategy-layout {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 2rem;
          margin-top: 1rem;
        }

        .control-panel {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          height: fit-content;
        }

        .income-slider-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .label-row label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .label-row .amount {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          color: var(--primary);
          font-size: 1.2rem;
        }

        .strategy-slider {
          width: 100%;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          appearance: none;
          outline: none;
        }

        .strategy-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: var(--primary);
          border: 4px solid #fff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .slider-hint {
          font-size: 0.8rem;
          color: var(--text-dim);
          line-height: 1.4;
        }

        .strategy-selector {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .strategy-selector label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .strategy-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .strategy-btn {
          padding: 1rem;
          background: rgba(255,255,255,0.4);
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }

        .strategy-btn:hover { background: rgba(255,255,255,0.8); border-color: var(--primary); }
        .strategy-btn.active { border-color: var(--primary); background: #f0f7ff; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1); }

        .btn-content { display: flex; flex-direction: column; }
        .btn-content .name { font-weight: 700; color: var(--text-main); font-size: 0.95rem; }
        .btn-content .meta { font-size: 0.8rem; color: var(--text-dim); margin-top: 0.2rem; }
        .strategy-btn .check { color: var(--primary); }

        .intelligence-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 1.5rem;
        }

        .main-roi { grid-column: span 2; padding: 2.5rem; }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
        .card-header h3 { margin: 0; font-size: 1.25rem; font-weight: 800; }
        
        .roi-badge {
          background: #f0fdf4;
          color: #16a34a;
          padding: 0.5rem 1rem;
          border-radius: 99px;
          font-weight: 800;
          font-size: 0.85rem;
          border: 1px solid #dcfce7;
        }

        .roi-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .roi-stat { display: flex; flex-direction: column; gap: 0.5rem; }
        .roi-stat .label { font-size: 0.85rem; font-weight: 600; color: var(--text-dim); }
        .roi-stat .val { font-size: 1.5rem; font-weight: 800; color: var(--text-main); font-family: 'Outfit', sans-serif; }
        .roi-stat .val.highlight { color: var(--primary); }

        .strategy-desc {
          padding: 1.25rem;
          background: #f8fafc;
          border-radius: 12px;
          border-left: 4px solid var(--primary);
        }

        .strategy-desc p { margin: 0; font-size: 1rem; color: var(--text-dim); line-height: 1.6; }

        .tax-intelligence-iq, .dtaa-intelligence { padding: 2rem; }
        .card-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .tab-switcher { 
          display: flex; gap: 4px; background: #f1f5f9; padding: 4px; border-radius: 12px; width: 100%;
        }
        .tab-btn {
          flex: 1; padding: 0.65rem; border: none; border-radius: 10px; font-size: 0.85rem; font-weight: 750;
          cursor: pointer; transition: all 0.2s; background: transparent; color: #64748b;
        }
        .tab-btn.active { background: white; color: var(--primary); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }

        .calculator-content { display: flex; flex-direction: column; gap: 1.5rem; }
        .iq-result-main { 
          background: #f8fafc; padding: 1.75rem; border-radius: 20px; text-align: center;
          display: flex; flex-direction: column; gap: 0.25rem; border: 1px solid #f1f5f9;
        }
        .iq-result-main.mini { padding: 1.25rem; }
        .iq-result-main .label { font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
        .iq-result-main .value { font-size: 1.85rem; font-weight: 900; color: #1e293b; }

        .iq-breakdown { display: flex; flex-direction: column; gap: 0.85rem; }
        .iq-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; font-weight: 700; }
        .iq-row span:first-child { color: var(--text-dim); }
        .iq-divider { height: 1.5px; background: #f1f5f9; margin: 0.5rem 0; }
        .total-savings { font-size: 1.15rem; color: #1e293b; font-weight: 800; }
        .text-blue { color: var(--primary); }
        
        .export-toggle-box { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 0.5rem; }
        .export-toggle-box label { font-size: 0.85rem; font-weight: 750; color: #1e293b; }
        .toggle-group { display: flex; gap: 8px; }
        .toggle-btn { 
          flex: 1; padding: 0.75rem; border: 1.5px solid #e2e8f0; border-radius: 10px; 
          font-size: 0.85rem; font-weight: 750; cursor: pointer; transition: all 0.2s; background: white; color: #64748b;
        }
        .toggle-btn.active { border-color: var(--primary); background: #f0f7ff; color: var(--primary); }
        
        .gst-note-box { 
          padding: 1.25rem; background: #f0fdf4; border-radius: 12px; border: 1px dashed #22c55e;
          display: flex; flex-direction: column; gap: 0.75rem;
        }
        .lut-info-hint { 
          display: flex; align-items: center; gap: 0.5rem; 
          background: rgba(255,255,255,0.5); padding: 0.6rem 0.75rem; 
          border-radius: 8px; color: #15803d; font-size: 0.725rem; font-weight: 750;
        }
        .gst-note-box p { margin: 0; font-size: 0.8rem; font-weight: 650; color: #16a34a; line-height: 1.4; }
        .gst-amount-row { display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid rgba(34, 197, 94, 0.2); }
        .gst-amount-row span { font-weight: 800; font-size: 0.95rem; color: #1e293b; }
        .text-dim { color: #94a3b8; }

        .residency-warning-box {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #fff5f5;
          border-radius: 8px;
          border: 1px dashed #feb2b2;
        }
 
        .residency-warning-box p {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.5;
          color: #c53030;
          font-weight: 500;
        }

        .dtaa-status { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
        .status-row { display: flex; justify-content: space-between; font-size: 0.95rem; }
        .status-row :first-child { color: var(--text-dim); }
        
        .audit-preview { display: flex; flex-direction: column; gap: 0.75rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; }
        .audit-preview label { font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; color: var(--text-main); }
        .audit-preview ul { margin: 0; padding-left: 1.25rem; }
        .audit-preview li { font-size: 0.9rem; color: var(--text-dim); margin-bottom: 0.4rem; }

        @media (max-width: 1024px) {
          .wealth-strategy-layout { grid-template-columns: 1fr; }
          .intelligence-grid { grid-template-columns: 1fr; }
          .main-roi { grid-column: auto; }
        }
      `}</style>
    </Layout>
  );
};

export default Wealth;

