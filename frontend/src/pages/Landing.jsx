import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <>
      <nav className="navbar-floating">
        <div className="nav-capsule">
          <Link to="/" className="nav-logo-box">
            <div className="logo-square"><Globe size={20} color="white" /></div>
          </Link>
          <div className="nav-menu">
            <a href="#features" className="nav-item">Features</a>
            <a href="#use-cases" className="nav-item">Use cases</a>
            <a href="#faqs" className="nav-item">FAQs</a>
            <a href="#demo" className="nav-item">Get a demo</a>
          </div>
          <div className="nav-actions-floating">
            <Link to="/auth" className="btn-get-started">Get started</Link>
          </div>
        </div>
      </nav>

      <div className="landing-container">
        {/* Hero Text Section */}
        <section className="hero hero-centered">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1 className="hero-title">Mastering Global <br />Tax & Compliance.</h1>
            <p className="hero-subtitle">
              Automate your 90/180-day residency tracking and tax compliance audits <br />
              across 150+ countries with our intelligent travel engine.
            </p>

            <div className="hero-actions">
              <Link to="/auth" className="btn btn-primary btn-hero">Start Tracking Now</Link>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Full-Width Dashboard Preview Section */}
      <section className="dashboard-full-view">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="dashboard-preview-placeholder"
        >
          {/* User will add image here */}
          <div className="placeholder-content">
            <span>Dashboard Preview Placeholder (Full Width Section)</span>
          </div>
        </motion.div>
      </section>

      <div className="landing-container">
        <div className="showcase-header no-sticky">
          <h2>Product Features</h2>
          <p>Nomad Tax is changing the game in the residency world and traditional tools don't even come close.</p>
        </div>
      </div>

      <section className="product-showcase">
        <div className="landing-container">
          <div className="feature-stack-container">
            {/* Feature 1: Intelligence Engine */}
            <div className="sticky-card-wrapper" style={{ zIndex: 1 }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="feature-card-main glass-card sticky-card"
              >
                <div className="feature-info">
                  <h3>Turn complex residency rules into instant tax clarity</h3>
                  <p>
                    Our intelligence engine dissects intricate visa policies (90/180-day windows, 183-day residency triggers)
                    and predicts your tax liability in real-time. Stay 100% audit-proof by following automated
                    residency optimization paths.
                  </p>
                  <Link to="/auth" className="btn-pill-black">Get started</Link>
                </div>

                <div className="feature-visual-mockup">
                  <div className="mockup-header">
                    <div className="mock-tabs">
                      <div className="tab active">Residency</div>
                      <div className="tab">Tax Rules</div>
                    </div>
                  </div>
                  <div className="mockup-body">
                    <div className="mock-stat-grid">
                      <div className="mock-stat">
                        <span className="label">Days Used</span>
                        <span className="value">142/183</span>
                        <div className="mini-progress"><div className="fill" style={{ width: '75%' }}></div></div>
                      </div>
                      <div className="mock-stat">
                        <span className="label">Risk Level</span>
                        <span className="value safe">SAFE</span>
                      </div>
                    </div>
                    <div className="mock-chart-placeholder">
                      <div className="mock-bar" style={{ height: '40%' }}></div>
                      <div className="mock-bar" style={{ height: '60%' }}></div>
                      <div className="mock-bar active" style={{ height: '90%' }}></div>
                      <div className="mock-bar" style={{ height: '50%' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Feature 2: Global Policy Vault */}
            <div className="sticky-card-wrapper" style={{ zIndex: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="feature-card-main glass-card inverted sticky-card"
              >
                <div className="feature-visual-mockup policy-vault">
                  <div className="rule-cards-stack">
                    <div className="rule-card mini">
                      <div className="card-top">
                        <span className="flag">🇦🇪</span>
                        <strong>UAE</strong>
                      </div>
                      <div className="tag">Residency: 183 Days</div>
                    </div>
                    <div className="rule-card mini highlight">
                      <div className="card-top">
                        <span className="flag">🇵🇹</span>
                        <strong>Portugal</strong>
                      </div>
                      <div className="tag">D7 Visa: Active</div>
                    </div>
                    <div className="rule-card mini">
                      <div className="card-top">
                        <span className="flag">🇲🇽</span>
                        <strong>Mexico</strong>
                      </div>
                      <div className="tag">Temporary Res: 4yr</div>
                    </div>
                  </div>
                </div>

                <div className="feature-info">
                  <h3>Stay ahead of changing residency laws in 150+ countries</h3>
                  <p>
                    Rules change, we don't blink. Our real-time database monitors digital nomad visas,
                    183-day thresholds, and bilateral tax treaties so you don't have to spend
                    hours on government websites.
                  </p>
                  <Link to="/auth" className="btn-pill-black">Explore Countries</Link>
                </div>
              </motion.div>
            </div>

            {/* Feature 3: Audit Reporting */}
            <div className="sticky-card-wrapper" style={{ zIndex: 3 }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="feature-card-main glass-card sticky-card"
              >
                <div className="feature-info">
                  <h3>Generate certified travel logs for tax authorities in seconds</h3>
                  <p>
                    Stop digging through flight emails and passport stamps. Generate high-fidelity
                    residency reports that stand up to the most rigorous tax audits, complete
                    with date-stamped physical presence evidence.
                  </p>
                  <Link to="/auth" className="btn-pill-black">Export Report</Link>
                </div>

                <div className="feature-visual-mockup audit-mock">
                  <div className="export-preview">
                    <div className="doc-header">
                      <h4>Audit Report 2026</h4>
                      <CheckCircle2 color="#1ca75f" size={20} />
                    </div>
                    <div className="doc-lines">
                      <div className="line"></div>
                      <div className="line half"></div>
                      <div className="line"></div>
                      <div className="line"></div>
                    </div>
                    <div className="doc-footer">
                      <div className="stamp">CERTIFIED</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <div className="landing-container">
        {/* Feature Grid */}
        <section id="features" className="features">
          <div className="section-header">
            <h2>Precision Intelligence</h2>
            <p>Built by nomads, for nomads. We handle the math, you handle the movement.</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bento-grid"
          >
            <motion.div variants={itemVariants} className="bento-item glass-card large">
              <div className="icon-wrapper"><Shield className="text-blue" /></div>
              <h3>90/180 Rule Mastery</h3>
              <p>Our rolling window engine ensures you never overstay in the Schengen area or other visa zones.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bento-item glass-card">
              <div className="icon-wrapper"><TrendingUp className="text-orange" /></div>
              <h3>Tax Threshold Alerts</h3>
              <p>Automatic notifications when you approach the 183-day residency trigger.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bento-item glass-card">
              <div className="icon-wrapper"><CheckCircle2 className="text-green" /></div>
              <h3>Audit-Ready Reports</h3>
              <p>Generate precise travel history logs for tax authorities with a single click.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bento-item glass-card wide">
              <h3>Global Policy Vault</h3>
              <p>Stay updated with the latest residency rules for over 150 countries, indexed and automated.</p>
            </motion.div>
          </motion.div>
        </section>

        {/* Social Proof / Footer */}
        <footer className="landing-footer glass-card">
          <div className="footer-content">
            <div className="brand">Nomad Tax</div>
            <div className="legal">© 2026 Nomad-Tax Platform. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
