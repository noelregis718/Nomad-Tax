import React from 'react';
import { Globe, Plane, Clock, User, LogOut } from 'lucide-react';

const Layout = ({ children, onAddClick }) => {
  return (
    <div className="layout-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'var(--bg-card)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="logo" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '3rem',
          fontSize: '1.5rem',
          fontWeight: 800,
          background: 'linear-gradient(to right, #6366f1, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          <Globe size={28} color="#6366f1" />
          NomadTax
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <NavItem icon={<Plane size={20} />} label="Dashboard" active />
            <NavItem icon={<Clock size={20} />} label="Travel History" />
            <NavItem icon={<Globe size={20} />} label="Tax Rules" />
            <NavItem icon={<User size={20} />} label="My Profile" />
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'var(--text-muted)',
            background: 'none',
            padding: '12px'
          }}>
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>Welcome back, Demo</h1>
            <p style={{ color: 'var(--text-muted)' }}>Here's your residency status for 2026.</p>
          </div>
          <button className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={onAddClick}
          >
            <Plane size={18} />
            Add New Stay
          </button>
        </header>

        {children}
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active }) => (
  <li>
    <a href="#" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      borderRadius: '12px',
      color: active ? 'white' : 'var(--text-muted)',
      background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
      textDecoration: 'none',
      fontWeight: 500,
      transition: 'all 0.2s ease'
    }}>
      <span style={{ color: active ? 'var(--primary)' : 'inherit' }}>{icon}</span>
      {label}
    </a>
  </li>
);

export default Layout;
