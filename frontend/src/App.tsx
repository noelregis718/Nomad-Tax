import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TravelProvider } from './context/TravelContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Rules from './pages/Rules';
import Wealth from './pages/Wealth';
import Audit from './pages/Audit';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import './index.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/auth" />;
  return children;
};

function App() {
  // Replace with your real GOOGLE_CLIENT_ID from .env or hardcoded for now
  const clientId = "replace_with_your_google_client_id.apps.googleusercontent.com"; 

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <TravelProvider>
          <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />
            <Route path="/rules" element={
              <ProtectedRoute>
                <Rules />
              </ProtectedRoute>
            } />
            <Route path="/wealth" element={
              <ProtectedRoute>
                <Wealth />
              </ProtectedRoute>
            } />
            <Route path="/audit" element={
              <ProtectedRoute>
                <Audit />
              </ProtectedRoute>
            } />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </Router>
        </TravelProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
