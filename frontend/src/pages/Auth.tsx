import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, Globe, MapPin, Search } from 'lucide-react';

const RadarAnimation = () => {
  return (
    <div className="radar-wrapper">
      <div className="radar-grid">
        <div className="radar-sweep" />
        
        {/* Compliance Nodes with Labels */}
        {[
          { x: '30%', y: '40%', label: 'UK: SAFE', delay: 0 },
          { x: '55%', y: '35%', label: 'FR: ACTIVE', delay: 1.5 },
          { x: '75%', y: '50%', label: 'UAE: SAFE', delay: 0.8 },
          { x: '45%', y: '70%', label: 'PT: RESIDENT', delay: 2.2 },
          { x: '20%', y: '25%', label: 'USA: MONITORING', delay: 1.2 },
          { x: '85%', y: '30%', label: 'SG: SAFE', delay: 0.5 },
          { x: '15%', y: '65%', label: 'CH: ACTIVE', delay: 1.8 }
        ].map((node, i) => (
          <motion.div 
            key={i}
            className="radar-node-container"
            style={{ left: node.x, top: node.y }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: node.delay }}
          >
            <div className="node-pulse" />
            <div className="node-dot" />
            <motion.div 
              className="node-label"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: node.delay + 0.5 }}
            >
              {node.label}
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="radar-stats-overlay">
        <div className="radar-stat-box">
          <div className="stat-text">
            <motion.span 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              MONITORING ACTIVE
            </motion.span>
            <strong>150+ COUNTRIES</strong>
          </div>
        </div>
      </div>

      {/* Decorative background map (Dotted) */}
      <div className="dotted-map-bg" />
    </div>
  );
};

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (response: CredentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        credential: response.credential
      });
      
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Google authentication failed.');
    }
  };

  const handleFailure = () => {
    console.error('Google Auth Failed');
    setError('Google Login failed.');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="auth-split-layout"
      >
        <div className="auth-visual-side">
          <RadarAnimation />
          <div className="auth-visual-overlay" />
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{isLogin ? 'Login to your Nomad-Tax dashboard' : 'Start tracking your global compliance'}</p>
          </div>

          <div className="auth-body">
            <form className="auth-form" onSubmit={handleAuth}>
              {!isLogin && (
                <div className="input-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required={!isLogin}
                  />
                </div>
              )}
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="nomad@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="auth-btn-primary" disabled={isLoading}>
                {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
              </button>
            </form>

            <div className="auth-mode-toggle">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </div>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="google-btn-wrapper">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleFailure}
                useOneTap
                theme="filled_blue"
                shape="pill"
              />
            </div>
          </div>

          <div className="auth-footer">
            <p>By continuing, you agree to our Terms of Service.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
