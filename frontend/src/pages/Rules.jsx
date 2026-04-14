import React, { useState } from 'react';
import { Search, Globe, Landmark, BadgeAlert, ArrowRight, Table, X, ShieldCheck, Briefcase, Stethoscope, Files, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';

const COUNTRIES_MOCK = [
  { 
    name: 'Portugal', code: 'PT', zone: 'Schengen', taxRate: '0-28% (NHR)', visaCost: '₹16,200', residency: '183 Days',
    rule: '183-Day residency threshold. Digital Nomad Visa (D7/DR) available. NHR tax regime potential.',
    detailedAnalysis: {
      visa: 'Digital Nomad Visa (D7/DR) for remote workers. Requirements: proof of periodic income (min. ₹2,75,000/mo), health insurance, criminal record check.',
      tax: 'NHR (Non-Habitual Resident) offers 20% flat rate on high-value activity or 0% on foreign income for 10 years.',
      health: 'Access to SNS (National Health Service) with User Number. Private insurance mandatory for initial visa stay.',
      audit: ['Keep 12 months of rental agreements', 'Download NIF registry documents', 'Save utility bills showing usage patterns']
    }
  },
  { 
    name: 'USA', code: 'US', zone: 'North America', taxRate: '10-37%', visaCost: '₹15,400', residency: '183 Days',
    rule: 'Substantial Presence Test (SPT) triggers tax residency. Global income taxable for Residents.',
    detailedAnalysis: {
      visa: 'Visitor (B1/B2) or O-1 Extraordinary Ability. B1/B2 does not allow local employment, but remote work for Indian entities is a gray area.',
      tax: 'Resident aliens taxed on worldwide income. Non-resident aliens taxed on US-source income only. 30% withholding on certain payments.',
      health: 'Extremely high cost. Premium private travel insurance over ₹80,000 coverage is essential.',
      audit: ['Track SPT days precisely', 'Save Indian tax residence certificate', 'Keep records of "closer connection" to India']
    }
  },
  { 
    name: 'Thailand', code: 'TH', zone: 'ASEAN', taxRate: '0-35%', visaCost: '₹2,500', residency: '180 Days',
    rule: 'LTR Visa for wealthy nomads. 180-day presence triggers tax residency on foreign income.',
    detailedAnalysis: {
      visa: 'LTR (Long-Term Resident) Visa: 10 years, renewable. Requires high annual income or ₹4.2 Crores in assets.',
      tax: 'Tax resident if staying 180+ days. Foreign income is taxable if remitted to Thailand in the same year it was earned.',
      health: 'LTR requires ₹42 Lakhs health insurance coverage. High-quality private hospitals available.',
      audit: ['TM30 notifications (crucial)', 'Bank statements showing remittance dates', 'Entry/Exit stamps in passport']
    }
  },
  { 
    name: 'Russia', code: 'RU', zone: 'CIS', taxRate: '13-15%', visaCost: '₹8,500', residency: '183 Days',
    rule: '183-day residency rule. Flat tax rate of 13% for residents. 30% for non-residents.',
    detailedAnalysis: {
      visa: 'Business or Private Visa. No specific Digital Nomad visa, but specialized worker routes exist.',
      tax: '13% income tax up to ₹45 Lakhs, 15% thereafter. Global income taxable for residents.',
      health: 'Compulsory Medical Insurance (OMS) for residents. Private insurance required for visa.',
      audit: ['Migration card copy', 'Registration of stay (uchet)', 'Proof of tax resident status']
    }
  },
  { 
    name: 'China', code: 'CN', zone: 'East Asia', taxRate: '3-45%', visaCost: '₹10,500', residency: '183 Days',
    rule: '183-day residency rule. Global income taxable after 6 consecutive years of residency.',
    detailedAnalysis: {
      visa: 'Z (Work) or M (Business) Visas. Remote work from China requires careful structuring to avoid local labor law breaches.',
      tax: 'Progressive rates from 3% to 45%. Monthly standard deduction of ₹60,000 for foreigners.',
      health: 'Mandatory social insurance for employees. International hospitals available in Tier 1 cities.',
      audit: ['Individual Income Tax (IIT) filings', 'Work permit documentation', 'Rental tax receipts (fapiao)']
    }
  },
  { 
    name: 'Australia', code: 'AU', zone: 'Oceania', taxRate: '19-45%', visaCost: '₹10,850', residency: '183 Days',
    rule: 'Multiple residency tests (183-day, Domicile). Foreign income exemptions for temporary residents.',
    detailedAnalysis: {
      visa: 'Skilled Independent (189) or WHV (not for Indians yet, but sub-462 under review). High cost and points-based.',
      tax: 'Residency for tax purposes is different from immigration. Temporary residents may avoid tax on foreign investment income.',
      health: 'Medicare access for some, but private health insurance (OVHC) mandatory for most visa holders.',
      audit: ['Medicare levy exemption docs', 'Group certificates (Income statements)', 'TFN (Tax File Number) records']
    }
  },
  { 
    name: 'Canada', code: 'CA', zone: 'North America', taxRate: '15-33%', visaCost: '₹12,500', residency: '183 Days',
    rule: 'Deemed resident after 183 days. Global income taxable. High provincial tax variations.',
    detailedAnalysis: {
      visa: 'Startup Visa or Express Entry. Recent "Digital Nomad" policy allows stays up to 6 months on a visitor visa.',
      tax: 'Federal tax + Provincial tax. Significant credits available for families and low earners.',
      health: 'Public healthcare (MSP/OHIP) after 3-month waiting period in some provinces. Private gap insurance needed.',
      audit: ['Notice of Assessment (NOA)', 'T4 Slips from employers', 'Provincial residency proof (driver license)']
    }
  },
  { 
    name: 'Spain', code: 'ES', zone: 'Schengen', taxRate: '15-24%', visaCost: '₹12,600', residency: '183 Days',
    rule: 'Digital Nomad Visa includes 15% tax flat rate (Beckham Law). Part of Schengen 90/180.',
    detailedAnalysis: {
      visa: 'Digital Nomad Visa (DNV): Up to 3 years initial. Requires degree or 3 years experience. Min income ~₹2,25,000/mo.',
      tax: 'Beckham Law variant: 15% flat tax on the first ₹5.4 Crores for up to 6 years.',
      health: 'Public system access with Social Security contributions. Private insurance required for the initial application.',
      audit: ['Empadronamiento (Town Hall registration)', 'Social Security registration proof']
    }
  },
  { 
    name: 'United Kingdom', code: 'GB', zone: 'Non-EU', taxRate: '20-45%', visaCost: '₹12,100', residency: 'SRT Test',
    rule: 'Statutory Residence Test (SRT) applies. Three-part test for residency.',
    detailedAnalysis: {
      visa: 'High Potential Individual (HPI) for top-tier graduates or Skilled Worker Visa.',
      tax: 'Remittance basis potentially available for non-domiciled individuals (changing in 2025).',
      health: 'IHS (Immigration Health Surcharge) mandatory, giving access to NHS.',
      audit: ['P60/P45 documents', 'Self-assessment records', 'Travel logs for SRT day counting']
    }
  },
  { 
    name: 'Germany', code: 'DE', zone: 'Schengen', taxRate: '14-45%', visaCost: '₹9,000', residency: '183 Days',
    rule: 'Freiberufler (Freelance) Visa available. High tax burden but excellent infrastructure.',
    detailedAnalysis: {
      visa: 'Freiberufler Visa for self-employed professionals. Requires local clients/interest.',
      tax: 'Progressive tax with high social security contributions (~20%). Solidarity surcharge may apply.',
      health: 'Mandatory health insurance (Public or Private). High quality, high cost.',
      audit: ['Anmeldung (Address registration)', 'Health insurance certificates', 'Tax ID (Steuernummer)']
    }
  },
  { 
    name: 'Japan', code: 'JP', zone: 'East Asia', taxRate: '0%', visaCost: '₹1,650', residency: 'Non-Resident',
    rule: 'New Digital Nomad Visa (Specified Activities) for 6-month stays. 0% tax for non-residents.',
    detailedAnalysis: {
      visa: 'Digital Nomad Visa: 6 months, non-renewable. Requires ₹55 Lakhs annual income and private insurance.',
      tax: '0% income tax if staying under 6 months on the DN visa. Otherwise, progressive rates apply.',
      health: 'National Health Insurance (NHI) not available for short-term DN visa. Private insurance mandatory.',
      audit: ['Certificate of Eligibility (COE)', 'Income proof from Indian entity', 'Insurance policy details']
    }
  },
  { 
    name: 'Mexico', code: 'MX', zone: 'Latham', taxRate: '0%', visaCost: '₹21,000', residency: 'None (Foreign Inc)',
    rule: 'Temporary Residency up to 4 years. No tax on foreign income if remote.',
    detailedAnalysis: {
      visa: 'Residente Temporal: Up to 4 years. Requires proof of economic solvency (~₹2,90,000/mo income).',
      tax: 'Technically non-resident if source is foreign. Remote work is generally tax-exempt locally.',
      health: 'IMSS public insurance available. Most nomads use international private plans.',
      audit: ['CURP registration', 'Bank records showing foreign deposits']
    }
  },
  { 
    name: 'UAE', code: 'AE', zone: 'GCC', taxRate: '0%', visaCost: '₹6,500', residency: '90 Days (Stay)',
    rule: '0% Personal income tax. Digital Nomad Visa for 1 year, renewable.',
    detailedAnalysis: {
      visa: 'Remote Work Visa: 1 year, renewable. Requires monthly income of ₹2,90,000+.',
      tax: '0% personal income tax, 0% capital gains tax. 9% Corporate tax might apply to businesses.',
      health: 'World-class private healthcare. Mandatory UAE coverage for visa holders.',
      audit: ['Emirates ID card copy', 'Ejari (Rental contract) registration']
    }
  },
  { 
    name: 'Italy', code: 'IT', zone: 'Schengen', taxRate: '5-43%', visaCost: '₹10,500', residency: '183 Days',
    rule: 'New Digital Nomad Visa launched in 2024. 70% tax reduction potential.',
    detailedAnalysis: {
      visa: 'Digital Nomad Visa (2024): 1 year renewable. Requires ₹25 Lakhs+ income.',
      tax: 'Lavoratori Impatriati: Up to 70% tax exemption for 5-10 years if relocating.',
      health: 'SSN (Servizio Sanitario Nazionale) access.',
      audit: ['Codice Fiscale certificate', 'Permesso di Soggiorno']
    }
  },
  { 
    name: 'Singapore', code: 'SG', zone: 'ASEAN / Financial Hub', taxRate: '0-22%', visaCost: '₹2,100', residency: '183 Days',
    rule: '183-day residency rule. No capital gains tax. Progressive income tax slabs.',
    detailedAnalysis: {
      visa: 'Personalized Employment Pass (PEP) or ONE Pass for high earners. Requires proof of ₹1.5 Crores+ annual income for ONE Pass.',
      tax: 'Tiered system: 0% to 22%. Foreign sourced income is generally not taxable in Singapore unless remitted through a local partnership.',
      health: 'Premium private healthcare. Mandatory for visa holders to have coverage of at least ₹9 Lakhs.',
      audit: ['FIN (Foreign Identification Number) card', 'Notice of Assessment from IRAS', 'Rental contract registered via Stamp Duty']
    }
  },
  { 
    name: 'Mauritius', code: 'MU', zone: 'Africa / Financial Hub', taxRate: '10-15%', visaCost: '₹0', residency: '183 Days',
    rule: 'Digital Nomad Premium Visa available for 1 year. 0% tax on foreign income for nomads.',
    detailedAnalysis: {
      visa: 'Premium Visa: Valid for 1 year, renewable. Requires proof of travel/health insurance and source of income outside Mauritius.',
      tax: '15% corporate and personal tax. No tax on dividends or capital gains. Nomads on Premium Visa stay tax-exempt on foreign income.',
      health: 'Private clinics are preferred by expats. Public hospitals are free for basic care.',
      audit: ['Certificate of Entry', 'Proof of funds (Bank statements)', 'Occupation Permit documents (if transitioning)']
    }
  }
];

const Rules = () => {
  const [search, setSearch] = useState('');

  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [activeAnalysisCountry, setActiveAnalysisCountry] = useState(null);

  React.useEffect(() => {
    if (isComparisonOpen || activeAnalysisCountry) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isComparisonOpen, activeAnalysisCountry]);

  const filtered = COUNTRIES_MOCK.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.zone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout 
      title="Global Rules Intelligence" 
      subtitle="Real-time residency and tax thresholds for 150+ countries."
    >
      <div className="rules-header-actions">
        <div className="search-box glass-card">
          <Search size={20} className="text-dim" />
          <input 
            type="text" 
            placeholder="Search countries, regions or tax zones..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          className="compare-btn"
          onClick={() => setIsComparisonOpen(true)}
        >
          Compare Intelligence
        </button>
      </div>

      <AnimatePresence>
        {activeAnalysisCountry && (
          <motion.div 
            className="comparison-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveAnalysisCountry(null)}
          >
            <motion.div 
              className="analysis-modal glass-card"
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="analysis-header">
                <div className="header-top">
                  <div className="country-chip">
                    <span className="code">{activeAnalysisCountry.code}</span>
                    <span className={`zone-badge ${activeAnalysisCountry.zone.toLowerCase()}`}>{activeAnalysisCountry.zone}</span>
                  </div>
                  <button className="close-btn" onClick={() => setActiveAnalysisCountry(null)}>
                    <X size={20} />
                  </button>
                </div>
                <h1>{activeAnalysisCountry.name} Policy Analysis</h1>
                <p className="subtitle">Official tax and residency requirements for 2024/2025.</p>
              </div>

              <div className="analysis-content">
                <div className="analysis-grid">
                  <div className="analysis-section">
                    <h3>Visa Intelligence</h3>
                    <p>{activeAnalysisCountry.detailedAnalysis?.visa || activeAnalysisCountry.rule}</p>
                    <div className="stat-row">
                      <span>Application Fee:</span>
                      <strong>{activeAnalysisCountry.visaCost}</strong>
                    </div>
                  </div>

                  <div className="analysis-section highlight">
                    <h3>Tax Liability</h3>
                    <p>{activeAnalysisCountry.detailedAnalysis?.tax || "Standard residency rules apply."}</p>
                    <div className="stat-row">
                      <span>Effective Rate:</span>
                      <strong>{activeAnalysisCountry.taxRate}</strong>
                    </div>
                  </div>

                  <div className="analysis-section">
                    <h3>Health & Social</h3>
                    <p>{activeAnalysisCountry.detailedAnalysis?.health || "Insurance mandatory for stay."}</p>
                  </div>

                  <div className="analysis-section audit-list">
                    <h3>Audit Readiness Checklist</h3>
                    <ul>
                      {(activeAnalysisCountry.detailedAnalysis?.audit || [
                        "Passport stamps & history",
                        "Accomodation contracts",
                        "Proof of foreign income"
                      ]).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="analysis-footer">
                <button className="primary-action-btn" onClick={() => setActiveAnalysisCountry(null)}>
                  Confirm & Save to Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isComparisonOpen && (
          <motion.div 
            className="comparison-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="comparison-modal glass-card"
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
            >
              <div className="modal-header">
                <div>
                  <h2>Global Comparison Engine</h2>
                  <p>Side-by-side tax and residency analysis</p>
                </div>
                <button className="close-btn" onClick={() => setIsComparisonOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="table-wrapper">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Country</th>
                      <th>Zone</th>
                      <th>Tax Rate</th>
                      <th>Visa Cost</th>
                      <th>Residency Trigger</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COUNTRIES_MOCK.map(c => (
                      <tr key={c.code}>
                        <td className="country-name-cell">
                          <span className="flag-placeholder">{c.code}</span>
                          {c.name}
                        </td>
                        <td><span className={`zone-badge ${c.zone.toLowerCase()}`}>{c.zone}</span></td>
                        <td className="highlight-cell">{c.taxRate}</td>
                        <td>{c.visaCost}</td>
                        <td>{c.residency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
              <button 
                className="link-btn"
                onClick={() => setActiveAnalysisCountry(country)}
              >
                Full Policy Analysis <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .rules-header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }
        .search-box {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          flex: 1;
          min-width: 300px;
          border-radius: 8px !important;
        }
        .search-box input {
          background: transparent;
          border: none;
          color: var(--text-main);
          width: 100%;
          outline: none;
          font-size: 1rem;
        }
        .compare-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .compare-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
          background: #2563eb;
        }
        
        /* Modal Styles */
        .comparison-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .comparison-modal {
          width: 100%;
          max-width: 1100px;
          max-height: 85vh;
          background: #ffffff !important;
          padding: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
        }
        .modal-header {
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          background: #ffffff;
        }
        .modal-header h2 { margin: 0; font-size: 1.75rem; }
        .modal-header p { margin: 0.25rem 0 0; color: var(--text-dim); }
        .close-btn {
          background: rgba(0, 0, 0, 0.05);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .close-btn:hover { background: rgba(0, 0, 0, 0.1); transform: rotate(90deg); }

        .table-wrapper {
          overflow: auto;
          flex: 1;
        }
        .comparison-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .comparison-table th {
          padding: 1.25rem 2rem;
          font-weight: 700;
          color: var(--text-dim);
          border-bottom: 2px solid rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          background: #ffffff;
          z-index: 100;
          text-align: left;
        }
        .comparison-table td {
          padding: 1.25rem 2rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          font-size: 0.95rem;
          background: #ffffff;
        }
        .country-name-cell {
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-main);
        }
        .flag-placeholder {
          font-size: 0.7rem;
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          opacity: 0.6;
        }
        .highlight-cell {
          color: var(--primary);
          font-weight: 700;
        }

        /* Analysis Modal Styles */
        .analysis-modal {
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          background: #ffffff !important;
          padding: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 32px 64px rgba(0, 0, 0, 0.25);
          border-radius: 20px;
        }
        .analysis-header {
          padding: 2.5rem 2.5rem 1.5rem;
          background: linear-gradient(to bottom right, #f8fafc, #ffffff);
          border-bottom: 1px solid #f1f5f9;
        }
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .country-chip { display: flex; gap: 0.75rem; align-items: center; }
        .country-chip .code { font-weight: 800; font-size: 0.9rem; color: var(--text-dim); }
        .analysis-header h1 { margin: 0; font-size: 2rem; color: var(--text-main); }
        .analysis-header .subtitle { margin-top: 0.5rem; color: var(--text-dim); font-size: 1.1rem; }

        .analysis-content { padding: 2.5rem; overflow-y: auto; }
        .analysis-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        .analysis-section { display: flex; flex-direction: column; gap: 1rem; }
        .analysis-section h3 { 
          display: flex; 
          align-items: center; 
          gap: 0.75rem; 
          margin: 0; 
          font-size: 1.1rem; 
          color: var(--text-main);
        }
        .analysis-section p { margin: 0; font-size: 1rem; line-height: 1.6; color: var(--text-dim); }
        .analysis-section.highlight {
          padding: 1.25rem;
          background: #f0f9ff;
          border-radius: 12px;
          border: 1px solid #e0f2fe;
          margin-top: -6mm;
        }
        .stat-row { 
          display: flex; 
          justify-content: space-between; 
          padding-top: 0.75rem; 
          border-top: 1px solid rgba(0,0,0,0.05); 
          font-size: 0.9rem; 
        }
        .stat-row strong { color: var(--primary); font-size: 1.1rem; }

        .audit-list ul { padding-left: 1.25rem; margin: 0; color: var(--text-dim); }
        .audit-list li { margin-bottom: 0.5rem; font-size: 0.95rem; }

        .analysis-footer {
          padding: 1.5rem 2.5rem 2.5rem;
          display: flex;
          justify-content: center;
        }
        .primary-action-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
        }
        .primary-action-btn:hover { background: #2563eb; transform: translateY(-2px); }

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
        .zone-badge.gcc { background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7; }
        .zone-badge.latham { background: #fff7ed; color: #ea580c; border: 1px solid #ffedd5; }
        
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

        @media (max-width: 768px) {
          .rules-header-actions { flex-direction: column; align-items: stretch; }
          .comparison-modal { height: 100vh; max-height: 100vh; border-radius: 0; }
        }
      `}</style>
    </Layout>
  );
};

export default Rules;
