import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, TrendingUp, ArrowRight, BadgeCheck, CheckCircle2, Circle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/ui/footer';

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

  const faqData = [
    {
      id: "01",
      question: "How current is the tax policy data?",
      answer: "All policy data updates hourly using live government streams, eliminating the delay of manual research. You retain full access to historical residency rules for 7 years for compliance and trend analysis."
    },
    {
      id: "02",
      question: "Does it work with existing travel apps?",
      answer: "Yes, we integrate with major calendar apps and flight tracking platforms to automatically sync your border crossings and physical presence data in real-time."
    },
    {
      id: "03",
      question: "How does pricing scale for teams?",
      answer: "Our platform scales seamlessly from solo nomads to distributed teams at global enterprises, with centralized compliance dashboards and per-user licensing options."
    },
    {
      id: "04",
      question: "What about GDPR/CCPA data privacy?",
      answer: "We are privacy-first. Your travel data is encrypted at rest and in transit, and we never sell your movement patterns to third parties. We are fully GDPR and CCPA compliant."
    },
    {
      id: "05",
      question: "How accurate are the residency alerts?",
      answer: "We use high-fidelity rolling window calculations that match official tax authority standards for the 90/180-day rule and 183-day residency triggers."
    },
    {
      id: "06",
      question: "How is this better than my spreadsheet?",
      answer: "Unlike static sheets, Nomad Tax provides real-time predictive alerts, certified PDF reports for authorities, and automated policy indexing for 150+ countries."
    }
  ];

  const FAQItem = ({ id, question, answer, isOpen, toggle }) => {
    return (
      <div className="faq-item">
        <button className="faq-question-row" onClick={toggle}>
          <div className="faq-q-content">
            <span className="faq-number">{id}.</span>
            <span className="faq-question">{question}</span>
          </div>
          <div className={`faq-toggle-switch ${isOpen ? 'active' : ''}`}>
            <div className="faq-slider" title={isOpen ? "Collapse" : "Expand"} />
          </div>
        </button>
        <motion.div
          initial={false}
          style={{ overflow: 'hidden' }}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="faq-answer"
        >
          <motion.div
            className="faq-answer-inner"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: isOpen ? 0 : -10, opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3, delay: isOpen ? 0.1 : 0 }}
          >
            {answer}
          </motion.div>
        </motion.div>
      </div>
    );
  };

  const [openFaqIndex, setOpenFaqIndex] = React.useState(0);

  return (
    <>
      <nav className="navbar-floating">
        <div className="nav-capsule">
          <Link to="/" className="nav-logo-link">
            <div className="logo-square">
              <img src="/taxes.png" alt="Logo" className="logo-img" />
            </div>
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

      <section id="features" className="product-showcase">
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
                        <div className="mini-progress">
                          <motion.div
                            className="fill"
                            initial={{ width: 0 }}
                            whileInView={{ width: '75%' }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </div>
                      <div className="mock-stat">
                        <span className="label">Risk Level</span>
                        <span className="value safe">SAFE</span>
                      </div>
                    </div>
                    <div className="mock-chart-placeholder">
                      {[40, 60, 90, 50].map((h, i) => (
                        <motion.div
                          key={i}
                          className={`mock-bar ${i === 2 ? 'active' : ''}`}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 + (i * 0.1) }}
                          viewport={{ once: true }}
                        />
                      ))}
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
                    {[
                      { flag: '🇦🇪', name: 'UAE', rule: 'Residency: 183 Days', delay: 0 },
                      { flag: '🇪🇸', name: 'Spain', rule: 'Beckham Law: 15% Tax', delay: 0.2 },
                      { flag: '🇵🇹', name: 'Portugal', rule: 'D7 Visa: Active', delay: 0.4, highlight: true },
                      { flag: '🇲🇽', name: 'Mexico', rule: 'Temporary Res: 4yr', delay: 0.6 },
                    ].map((country, i) => (
                      <motion.div
                        key={i}
                        className={`rule-card mini ${country.highlight ? 'highlight' : ''}`}
                        initial={{ x: -250, opacity: 0 }}
                        whileInView={{ x: i * 60, opacity: 1 }}
                        transition={{ duration: 0.8, delay: country.delay, ease: "easeOut" }}
                        viewport={{ once: true }}
                        style={{ position: 'relative', zIndex: i }}
                      >
                        <div className="card-top">
                          <span className="flag">{country.flag}</span>
                          <strong>{country.name}</strong>
                        </div>
                        <div className="tag">{country.rule}</div>
                      </motion.div>
                    ))}
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

                <div className="feature-visual-mockup audit-mock" style={{ position: 'relative' }}>
                  <div className="export-preview" style={{ width: '240px', padding: '1.25rem', overflow: 'hidden' }}>

                    {/* Scanning Line Animation */}
                    <motion.div
                      style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                        background: 'linear-gradient(90deg, transparent, #1ca75f, transparent)',
                        boxShadow: '0 0 8px #1ca75f', zIndex: 5
                      }}
                      initial={{ top: '0%', opacity: 1 }}
                      whileInView={{ top: '100%', opacity: 0 }}
                      transition={{ duration: 2, ease: "linear" }}
                      viewport={{ once: true }}
                    />

                    {/* Top Verified Badge */}
                    <motion.div
                      style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: '#f0fdf4', color: '#16a34a',
                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem',
                        fontWeight: 700, border: '1px solid #bdf2d0',
                        zIndex: 10
                      }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 1.5 }}
                      viewport={{ once: true }}
                    >
                      SECURE
                    </motion.div>

                    <motion.div
                      className="doc-header"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <h4 style={{ fontSize: '0.8rem' }}>Residency Audit</h4>
                      <CheckCircle2 color="#1ca75f" size={16} />
                    </motion.div>

                    {/* Summary Stats Row */}
                    <div style={{ display: 'flex', gap: '10px', margin: '0.75rem 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                      {['12 TRAVELS', '240 DAYS', '100% SAFE'].map((s, i) => (
                        <motion.div
                          key={i}
                          style={{ display: 'flex', flexDirection: 'column' }}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.4 + (i * 0.1) }}
                          viewport={{ once: true }}
                        >
                          <span style={{ fontSize: '0.5rem', fontWeight: 800, color: '#1ca75f' }}>{s.split(' ')[0]}</span>
                          <span style={{ fontSize: '0.4rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{s.split(' ')[1]}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="doc-lines" style={{ marginLeft: '1.25rem', borderLeft: '1px dashed #e2e8f0', paddingLeft: '0.75rem', position: 'relative' }}>
                      {[
                        { w: 1, date: 'JAN' },
                        { w: 0.5, date: 'MAR' },
                        { w: 0.8, date: 'JUN' },
                        { w: 1, date: 'OCT' }
                      ].map((item, i) => (
                        <div key={i} style={{ position: 'relative', marginBottom: '0.75rem' }}>
                          <motion.span
                            style={{ position: 'absolute', left: '-1.75rem', fontSize: '0.45rem', color: '#94a3b8', fontWeight: 700, top: '0' }}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.6 + (i * 0.1) }}
                            viewport={{ once: true }}
                          >
                            {item.date}
                          </motion.span>
                          <motion.div
                            className={`line ${item.w === 0.5 ? 'half' : ''}`}
                            style={{ width: 0, height: '4px', background: '#f1f5f9', borderRadius: '2px' }}
                            whileInView={{ width: item.w === 0.5 ? '50%' : (item.w === 0.8 ? '80%' : '100%') }}
                            transition={{ duration: 0.5, delay: 0.8 + (i * 0.1) }}
                            viewport={{ once: true }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="doc-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.25rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <motion.div
                          style={{ width: '60px', height: '1px', background: '#cbd5e1' }}
                          initial={{ width: 0 }}
                          whileInView={{ width: '60px' }}
                          transition={{ delay: 1.2 }}
                          viewport={{ once: true }}
                        />
                        <span style={{ fontSize: '0.4rem', color: '#94a3b8' }}>OFFICIAL SIGNATURE</span>
                      </div>

                      {/* Mini QR Code Placeholder */}
                      <motion.div
                        style={{
                          width: '24px', height: '24px',
                          border: '1px solid #e2e8f0', pading: '2px',
                          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px'
                        }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                        viewport={{ once: true }}
                      >
                        {[...Array(9)].map((_, i) => (
                          <div key={i} style={{ background: i % 2 === 0 ? '#64748b' : 'transparent', width: '100%', height: '100%' }} />
                        ))}
                      </motion.div>

                      <motion.div
                        className="stamp"
                        initial={{ scale: 3, opacity: 0, rotate: 0 }}
                        whileInView={{ scale: 1, opacity: 1, rotate: -15 }}
                        transition={{ type: "spring", damping: 10, stiffness: 100, delay: 1.8 }}
                        viewport={{ once: true }}
                        style={{ position: 'absolute', right: '15px', bottom: '15px' }}
                      >
                        CERTIFIED
                      </motion.div>
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
        <div className="showcase-header no-sticky">
          <h2>Use Cases</h2>
          <p style={{ marginBottom: '12mm' }}>Tailored compliance intelligence for every global movement profile.</p>
        </div>
        <section id="use-cases" className="features">

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bento-grid"
          >
            <motion.div variants={itemVariants} className="bento-item glass-card large">
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem', display: 'block' }}>01.</span>
              <h3>The Schengen Nomad</h3>
              <p>Master the 90/180-day rule with a smart rolling window engine that accurately predicts your safe re-entry dates. Automatically calculate your remaining days across all 29 member states with high-fidelity accuracy and zero manual math. Receive predictive re-entry alerts to plan your next movement without the risk of overstaying your 90-day allowance. Stay 100% audit-ready with date-stamped physical presence records that meet the most rigorous tax residency standards worldwide. Never lose track of your cross-border movements again.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bento-item glass-card">
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem', display: 'block' }}>02.</span>
              <h3>Remote Professionals</h3>
              <p>Eliminate local tax risks and corporate residency triggers by keeping your physical presence within safe thresholds.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bento-item glass-card">
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem', display: 'block' }}>03.</span>
              <h3>Frequent Flyers</h3>
              <p>A unified dashboard to monitor visa-free limits and entry counts for 150+ countries simultaneously, powered by real-time policy intelligence.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bento-item glass-card wide">
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem', display: 'block' }}>04.</span>
              <h3>Residency Optimization</h3>
              <p>Mathematically optimize your stays across multiple tax-favorable jurisdictions to legally minimize your global tax footprint through certified travel proofs.</p>
            </motion.div>
          </motion.div>
        </section>

        {/* Comparison Section */}
        <div className="showcase-header no-sticky comparison-header" style={{ marginTop: '15mm' }}>
          <h2>Traditional residency tracking <br /> <span>don't cut it anymore</span></h2>
          <p style={{ maxWidth: 'none' }}>Nomad Tax outperforms manual tracking with real-time intelligence.</p>
        </div>
        <section className="comparison-section">

          <div className="comparison-grid">
            {/* Traditional Column */}
            <div className="method-column">
              <h3>Traditional Residency Tracking</h3>
              <div className="method-list">
                {[
                  "Manual spreadsheets (prone to error)",
                  "Calendar counting (exhausting)",
                  "Lost passport stamps & baggage tags",
                  "Missed tax deadlines & triggers",
                  "Unverified trip evidence",
                  "Complex legal jargon",
                  "Audit risks & legal exposure"
                ].map((item, i) => (
                  <div key={i} className="method-item traditional">
                    <Circle size={22} className="icon-fail" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nomad Tax Column */}
            <motion.div
              className="comparison-card nomad-card-advantage"
              style={{ marginTop: '-15mm' }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3>Nomad Tax</h3>
              <div className="nomad-feature-list">
                {[
                  "Real-time 90/180 day window tracking",
                  "Predictive safe re-entry engine",
                  "Encrypted verified evidence vault",
                  "Automatic tax residency threshold alerts",
                  "One-click certified PDF residency reports",
                  "Global policy indexing for 150+ countries",
                  "Digital signature & QR verification"
                ].map((item, i) => (
                  <div key={i} className="nomad-feature-item">
                    <div className="icon-check-wrapper">
                      <Check size={18} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </section>

        {/* FAQ Section */}
        <section id="faqs" className="faq-section">
          <div className="faq-grid">
            <motion.div
              className="faq-left"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2>FAQs</h2>
              <p className="subtitle">Answers to some of the most frequently asked questions.</p>
              <div className="faq-contact">
                Have more questions? <br /> Reach out to our team via email - <a href="mailto:noelregis718@gmail.com">noelregis718@gmail.com</a>
              </div>
            </motion.div>

            <motion.div
              className="faq-right"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="faq-list">
                {faqData.map((faq, index) => (
                  <FAQItem
                    key={faq.id}
                    id={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFaqIndex === index}
                    toggle={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer
        logo={
          <div className="logo-square h-10 w-10 flex items-center justify-center bg-primary rounded-xl">
            <img src="/taxes.png" alt="Logo" className="logo-img" />
          </div>
        }
        brandName="Nomad Tax"
        socialLinks={[
          {
            icon: (
              <svg width={20} height={20} className="fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" />
              </svg>
            ),
            href: "https://x.com/NoelRegis8",
            label: "Twitter"
          },
          {
            icon: (
              <svg width={20} height={20} className="fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            ),
            href: "https://www.linkedin.com/in/noel-regis-aa07081b1/",
            label: "LinkedIn"
          },
          {
            icon: (
              <svg width={20} height={20} className="fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            ),
            href: "https://github.com/noelregis718/Nomad-Tax",
            label: "GitHub"
          },
        ]}
        legalLinks={[
          { href: "/privacy", label: "Privacy Policy" },
          { href: "/terms", label: "Terms of Service" },
        ]}
        copyright={{
          text: "© 2026 Nomad Tax platform.",
          license: "All rights reserved. Built for the global movement.",
        }}
      />
    </>
  );
};

export default Landing;
