import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
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
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-date">Last updated: April 1, 2026</p>
        </motion.header>

        <motion.section 
          className="legal-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >

          <div className="legal-section">
            <h2 className="legal-section-title">1. Personal Data You Provide</h2>
            <ul className="legal-list">
              <li>
                <strong>Account Information:</strong> When you create an account, we collect your name, email address, password, and other necessary details to maintain your account.
              </li>
              <li>
                <strong>Contact Information:</strong> Any Personal Data you provide through emails, contact forms, or other communications.
              </li>
              <li>
                <strong>Financial Information:</strong> If you purchase a subscription, we collect credit card information through secure payment providers. We do not store credit card details.
              </li>
              <li>
                <strong>Travel & Log Data:</strong> Border crossing dates, flight confirmations, and GPS-verified movement logs shared to automate residency tracking.
              </li>
              <li>
                <strong>Compliance Documentation:</strong> Scanned copies of residency certificates, tax returns, or income statements uploaded to the Audit Vault.
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">2. Usage Data</h2>
            <p className="legal-text">
              We automatically collect technical data like your IP address, browser type, and device information to improve our services and ensure platform security.
            </p>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">3. Data Security</h2>
            <p className="legal-text">
              We implement industry-standard security measures, including end-to-end encryption for sensitive documents and multi-factor authentication for account access. Your data is stored on secure, SOC 2 compliant servers.
            </p>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">4. Data Retention</h2>
            <p className="legal-text">
              We retain your Personal Data only for as long as necessary to provide our services and comply with legal obligations. Financial records are kept for 7 years to meet tax compliance standards, while travel logs can be deleted at any time upon user request.
            </p>
          </div>

          <div className="legal-section">
            <h2 className="legal-section-title">5. Your Rights</h2>
            <p className="legal-text">
              You have the right to access, correct, or delete your Personal Data. You may also request a portable copy of your data or object to certain processing activities. To exercise these rights, please contact our privacy team at the email provided below.
            </p>
          </div>
        </motion.section>

        <footer className="mt-24 pt-12 border-t border-slate-100">
          <p className="text-slate-400 text-sm">
            Questions? Contact <a href="mailto:noelregis718@gmail.com" className="text-black font-bold hover:underline">noelregis718@gmail.com</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
