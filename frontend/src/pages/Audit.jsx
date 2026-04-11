import { FolderLock, Download, Upload, ShieldCheck, FileText, CheckCircle, Clock, Calendar, AlertTriangle, History, Link2, Zap, Globe, FlaskConical } from 'lucide-react';
import Layout from '../components/Layout';

const Audit = () => {
  return (
    <Layout 
      title="Audit Readiness" 
      subtitle="Manage your verified presence documentation and generated residency reports."
    >

      <div className="audit-dashboard">
        {/* Report Card */}
        <div className="glass-card report-generator-card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
          <div className="report-info">
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

          {/* Connected Sources */}
          <div className="glass-card sources-card" style={{ padding: '2rem' }}>
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Connected Sources</h3>
            </div>
            <div className="sources-list">
              <div className="source-item">
                <div className="s-details">
                  <span className="s-name">Google Timeline</span>
                  <span className="s-status px-badge small safe">Synced</span>
                </div>
              </div>
              <div className="source-item">
                <div className="s-details">
                  <span className="s-name">Bank of America</span>
                  <span className="s-status px-badge small safe">Reconciled</span>
                </div>
              </div>
              <div className="source-item">
                <div className="s-details">
                  <span className="s-name">Revolut Business</span>
                  <span className="s-status px-badge small">Attention</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Tertiary Grid for Enhanced Utility */}
        <div className="audit-tertiary-grid" style={{ marginTop: '2rem' }}>
          {/* Critical Deadlines */}
          <div className="glass-card deadline-card" style={{ padding: '2rem' }}>
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Critical Deadlines</h3>
            </div>
            <div className="deadline-list">
              <div className="deadline-item">
                <div className="d-info">
                  <span className="d-label">Visa Renewal (PT D7)</span>
                  <span className="d-date">May 14, 2026</span>
                </div>
                <div className="d-countdown px-badge">32 Days Left</div>
              </div>
              <div className="deadline-item">
                <div className="d-info">
                  <span className="d-label">Tax Filing (UK SRT)</span>
                  <span className="d-date">Jan 31, 2027</span>
                </div>
                <div className="d-countdown px-badge safe">290 Days Left</div>
              </div>
            </div>
          </div>

          {/* Schengen Budget Tracker */}
          <div className="glass-card schengen-card" style={{ padding: '2rem' }}>
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Schengen Budget</h3>
            </div>
            <div className="budget-content">
              <div className="budget-stats">
                <div className="b-stat">
                  <span className="b-val">64/90</span>
                  <span className="b-label">Days Used</span>
                </div>
                <div className="b-stat">
                  <span className="b-val">26</span>
                  <span className="b-label">Remaining</span>
                </div>
              </div>
              <div className="budget-progress-bar">
                <div className="fill" style={{ width: '71%' }}></div>
              </div>
              <p className="budget-note">Current 180-day window ends Jun 12th.</p>
            </div>
          </div>

          {/* Audit Activity Log */}
          <div className="glass-card log-card" style={{ padding: '2rem' }}>
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Audit Activity</h3>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="act-details">
                  <span className="act-title">Schengen Report Generated</span>
                  <span className="act-time">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="act-details">
                  <span className="act-title">Proof of Stay Verified (Spain)</span>
                  <span className="act-time">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .audit-dashboard { width: 100%; max-width: 100%; }
        .report-generator-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .report-info { display: flex; align-items: center; gap: 1.5rem; }
        .rep-text h3 { margin-bottom: 0.25rem; }
        .rep-text p { color: var(--text-dim); font-size: 0.95rem; }
        
        .audit-secondary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .audit-tertiary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }

        .vault-stats { display: flex; gap: 2rem; margin: 1.5rem 0; }
        .v-stat { display: flex; flex-direction: column; }
        .v-stat .count { font-size: 1.5rem; font-weight: 800; }
        .v-stat .label { font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; }
        
        .upload-zone {
          border: 2px dashed var(--glass-border);
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-dim);
          font-size: 0.85rem;
        }

        .health-meter { display: flex; align-items: center; gap: 1rem; margin: 1.25rem 0; }
        .meter-ring {
          width: 60px;
          height: 60px;
          border: 5px solid #f0fdf4;
          border-top-color: #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .meter-ring .percentage { font-weight: 800; color: #16a34a; font-size: 0.9rem; }
        .health-details p { font-size: 0.85rem; color: var(--text-dim); line-height: 1.4; }
        
        .health-list { list-style: none; padding: 0; margin-top: 1rem; }
        .health-list li { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; margin-bottom: 0.5rem; }

        /* Sources Card Styles */
        .sources-list { display: flex; flex-direction: column; gap: 1rem; }
        .source-item { display: flex; align-items: center; gap: 1rem; }
        .s-icon {
          width: 32px;
          height: 32px;
          background: rgba(0,0,0,0.04);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
        }
        .s-details { flex: 1; display: flex; justify-content: space-between; align-items: center; }
        .s-name { font-size: 0.9rem; font-weight: 600; }
        .px-badge.small { padding: 0.25rem 0.5rem; font-size: 0.65rem; }

        /* Enhanced Utility Styles */
        .deadline-list, .activity-list { display: flex; flex-direction: column; gap: 1rem; }
        .deadline-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(0,0,0,0.02);
          border-radius: 10px;
        }
        .d-info { display: flex; flex-direction: column; gap: 0.25rem; }
        .d-label { font-weight: 700; font-size: 0.9rem; }
        .d-date { font-size: 0.8rem; color: var(--text-dim); }
        .px-badge {
          padding: 0.4rem 0.75rem;
          background: #fef2f2;
          color: #ef4444;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .px-badge.safe { background: #f0fdf4; color: #22c55e; }

        .budget-stats { display: flex; justify-content: space-between; margin-bottom: 1.5rem; }
        .b-stat { display: flex; flex-direction: column; }
        .b-val { font-size: 1.25rem; font-weight: 800; }
        .b-label { font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; }
        .budget-progress-bar { height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; margin-bottom: 1rem; }
        .budget-progress-bar .fill { height: 100%; background: var(--primary); border-radius: 4px; }
        .budget-note { font-size: 0.8rem; color: var(--text-dim); }

        .activity-item { display: flex; align-items: center; gap: 1rem; }
        .act-icon {
          width: 32px;
          height: 32px;
          background: rgba(0,0,0,0.04);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
        }
        .act-details { display: flex; flex-direction: column; }
        .act-title { font-size: 0.9rem; font-weight: 600; }
        .act-time { font-size: 0.75rem; color: var(--text-dim); }
      `}</style>
    </Layout>
  );
};

export default Audit;


