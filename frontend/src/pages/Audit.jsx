import React from 'react';
import { FolderLock, Download, Upload, ShieldCheck, FileText, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';

const Audit = () => {
  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2 className="section-title">Audit Readiness</h2>
          <p className="section-subtitle">Manage your verified presence documentation and generated residency reports.</p>
        </div>
      </div>

      <div className="audit-dashboard">
        {/* Report Card */}
        <div className="glass-card report-generator-card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
          <div className="report-info">
            <div className="rep-icon"><FileText size={40} className="text-blue" /></div>
            <div className="rep-text">
              <h3>2026 Residency Compliance Statement</h3>
              <p>Verified travel history, Schengen window status, and tax residency analysis.</p>
            </div>
          </div>
          <button className="btn btn-primary">
            <Download size={18} />
            Generate PDF Report
          </button>
        </div>

        <div className="audit-secondary-grid">
          {/* Document Vault */}
          <div className="glass-card vault-card" style={{ padding: '2rem' }}>
            <div className="card-header">
              <FolderLock size={20} className="text-orange" />
              <h3>Evidence Vault</h3>
            </div>
            <div className="vault-stats">
              <div className="v-stat">
                <span className="count">12</span>
                <span className="label">Invoices</span>
              </div>
              <div className="v-stat">
                <span className="count">8</span>
                <span className="label">Boarding Passes</span>
              </div>
            </div>
            <div className="upload-zone">
              <Upload size={24} className="text-dim" />
              <p>Drag files here to add proof of stay</p>
              <button className="btn btn-secondary btn-sm">Browse Files</button>
            </div>
          </div>

          {/* Verification Status */}
          <div className="glass-card verification-card" style={{ padding: '2rem' }}>
            <div className="card-header">
              <ShieldCheck size={20} className="text-green" />
              <h3>Verification Health</h3>
            </div>
            <div className="health-meter">
              <div className="meter-ring">
                <span className="percentage">85%</span>
              </div>
              <div className="health-details">
                <p>Your travel data is highly consistent with cross-border tax standards.</p>
              </div>
            </div>
            <ul className="health-list">
              <li><CheckCircle size={14} className="text-green" /> No overlapping stays</li>
              <li><CheckCircle size={14} className="text-green" /> Full gap coverage</li>
              <li><CheckCircle size={14} className="text-dim" /> Missing 2 boarding passes</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .audit-dashboard { max-width: 1000px; }
        .report-generator-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .report-info { display: flex; align-items: center; gap: 1.5rem; }
        .rep-text h3 { margin-bottom: 0.25rem; }
        .rep-text p { color: var(--text-dim); font-size: 0.95rem; }
        
        .audit-secondary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .vault-stats { display: flex; gap: 2rem; margin: 1.5rem 0; }
        .v-stat { display: flex; flex-direction: column; }
        .v-stat .count { font-size: 1.5rem; font-weight: 800; }
        .v-stat .label { font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; }
        
        .upload-zone {
          border: 2px dashed var(--glass-border);
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: var(--text-dim);
          font-size: 0.9rem;
        }

        .health-meter { display: flex; align-items: center; gap: 1.5rem; margin: 2rem 0; }
        .meter-ring {
          width: 70px;
          height: 70px;
          border: 6px solid #f0fdf4;
          border-top-color: #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .meter-ring .percentage { font-weight: 800; color: #16a34a; }
        .health-details p { font-size: 0.9rem; color: var(--text-dim); line-height: 1.5; }
        
        .health-list { list-style: none; padding: 0; margin-top: 1.5rem; }
        .health-list li { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; margin-bottom: 0.5rem; }
      `}</style>
    </Layout>
  );
};

export default Audit;
