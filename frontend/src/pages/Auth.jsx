import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = async (response) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        credential: response.credential
      });
      
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Authentication failed. Please try again.');
    }
  };

  const handleFailure = () => {
    console.error('Google Auth Failed');
    alert('Google Login failed.');
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="auth-card glass-card"
      >
        <div className="auth-header">
          <div className="auth-logo">
            <Shield size={40} className="text-blue" />
          </div>
          <h2>Welcome Back</h2>
          <p>Login to your Nomad-Tax intelligence dashboard</p>
        </div>

        <div className="auth-body">
          <div className="google-btn-wrapper">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleFailure}
              useOneTap
              theme="filled_blue"
              shape="pill"
            />
          </div>
          
          <div className="auth-divider">
            <span>or secure with Google Single Sign-On</span>
          </div>
        </div>

        <div className="auth-footer">
          <p>By continuing, you agree to our Terms of Service.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
