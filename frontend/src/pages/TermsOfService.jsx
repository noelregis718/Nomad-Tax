import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white py-20 legal-page-layout">
      <div className="landing-container max-w-4xl mx-auto px-6">
        
        <motion.header 
          className="legal-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-date">Last updated: April 1, 2026</p>
        </motion.header>

        <motion.section 
          className="legal-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >

          <div className="legal-section">
            <h2 className="legal-section-title">1. Acceptance of Terms</h2>
            <p className="legal-text">
              By accessing or using Nomad Tax, you agree to be bound by these Terms. If you do not agree to these terms, you must not access or use our platform.
            </p>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">2. Platform Purpose & Limitations</h2>
            <p className="legal-text">
              Nomad Tax provides intelligence and data tracking tools for residency and tax estimation. We are **NOT** a tax advisory service, law firm, or professional fiduciary. All simulations and tracking data should be verified with a certified tax professional in your specific jurisdiction.
            </p>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">3. User Responsibilities</h2>
            <p className="legal-text">
              You are responsible for the accuracy of all data entered into the platform. You must maintain the security of your account and immediately notify us of any unauthorized access.
            </p>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">4. Intellectual Property</h2>
            <p className="legal-text">
              The algorithms, design, and software that power Nomad Tax are the exclusive property of Nomad Tax Inc. You are granted a limited license to use the platform for authorized purposes.
            </p>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">5. Termination of Service</h2>
            <p className="legal-text">
              We reserve the right to suspend or terminate access to the platform for users who violate these terms, provide fraudulent data, or engage in unauthorized use of the platform's intelligence data.
            </p>
          </div>
        </motion.section>

        <footer className="mt-24 pt-12 border-t border-slate-100">
          <p className="text-slate-400 text-sm">
            Need clarification? Contact <a href="mailto:noelregis718@gmail.com" className="text-black font-bold hover:underline">noelregis718@gmail.com</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TermsOfService;
