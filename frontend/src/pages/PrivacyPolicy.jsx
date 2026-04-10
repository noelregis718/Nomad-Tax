import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="landing-container max-w-4xl mx-auto px-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-black transition-colors mb-16 group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Nomad Tax
        </Link>
        
        <header className="mb-16">
          <h1 className="text-6xl font-black text-black mb-6 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-500 text-lg">Last updated: July 1, 2025</p>
        </header>

        <section className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-800 mb-12 leading-relaxed">
            Welcome! <br/><br/>
            This Privacy Policy ("Policy") outlines how we collect, process, share, and protect your Personal Data when you use our website <strong>NomadTax.io</strong> ("Website") and our related services ("Services"). This Policy applies to both users of our Services and professionals whose contact details appear in our Services. Please read this Policy carefully to understand how we handle your Personal Data and your rights regarding it.
          </p>

          <div className="space-y-16 mt-20">
            <div>
              <h2 className="text-4xl font-bold text-black mb-8 tracking-tight">Personal Data We Collect</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-black mb-4">1. Personal Data You Provide:</h3>
                  <ul className="space-y-4 text-slate-600 text-lg list-none pl-0">
                    <li className="flex gap-3">
                      <span className="text-black font-bold">·</span>
                      <span><strong className="text-black">Account Information:</strong> When you create an account, we collect your name, email address, password, and other necessary details to maintain your account.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-black font-bold">·</span>
                      <span><strong className="text-black">Contact Information:</strong> Any Personal Data you provide through emails, contact forms, or other communications.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-black font-bold">·</span>
                      <span><strong className="text-black">Support Information:</strong> Details provided when requesting technical support, including your name, contact details, and support request specifics.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-black font-bold">·</span>
                      <span><strong className="text-black">Financial Information:</strong> If you purchase a subscription, we collect credit card information through secure payment providers. We do not store credit card details.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-black mb-4">2. Usage Data:</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    We automatically collect technical data like your IP address, browser type, and device information to improve our services and ensure platform security.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-black mb-8 tracking-tight">3. Data Security</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                We implement industry-standard security measures, including end-to-end encryption for sensitive documents and multi-factor authentication for account access. Your data is stored on secure, SOC 2 compliant servers.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-20 pt-12 border-t border-slate-100">
          <p className="text-slate-400 text-sm">
            Questions? Contact <a href="mailto:privacy@nomadtax.io" className="text-black font-bold hover:underline">privacy@nomadtax.io</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
