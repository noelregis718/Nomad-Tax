import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
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
          <h1 className="text-6xl font-black text-black mb-6 tracking-tight">Terms of Service</h1>
          <p className="text-slate-500 text-lg">Last updated: July 1, 2025</p>
        </header>

        <section className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-800 mb-12 leading-relaxed">
            Welcome to Nomad Tax! <br/><br/>
            These Terms of Service ("Terms") govern your access to and use of our platform and services. By using Nomad Tax, you agree to these legal terms and our Privacy Policy. Please read them carefully.
          </p>

          <div className="space-y-16 mt-20">
            <div>
              <h2 className="text-4xl font-bold text-black mb-8 tracking-tight">User Agreement</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-black mb-4">1. Acceptance of Terms:</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    By accessing or using Nomad Tax, you agree to be bound by these Terms. If you do not agree to these terms, you must not access or use our platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-black mb-4">2. Platform Purpose & Limitations:</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Nomad Tax provides intelligence and data tracking tools for residency and tax estimation. We are **NOT** a tax advisory service, law firm, or professional fiduciary. All simulations and tracking data should be verified with a certified tax professional in your specific jurisdiction.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-black mb-4">3. User Responsibilities:</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    You are responsible for the accuracy of all data entered into the platform. You must maintain the security of your account and immediately notify us of any unauthorized access.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-black mb-4">4. Intellectual Property:</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    The algorithms, design, and software that power Nomad Tax are the exclusive property of Nomad Tax Inc. You are granted a limited license to use the platform for authorized purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-20 pt-12 border-t border-slate-100">
          <p className="text-slate-400 text-sm">
            Need clarification? Contact <a href="mailto:legal@nomadtax.io" className="text-black font-bold hover:underline">legal@nomadtax.io</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TermsOfService;
