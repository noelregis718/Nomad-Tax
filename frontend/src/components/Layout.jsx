import { Globe, Plane, Clock, User, LogOut, LayoutDashboard, Map, FlaskConical, FolderLock, BookOpen, Search, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Layout = ({ children, onAddClick, title, subtitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Clock size={20} />, label: 'History', path: '/history' },
    { icon: <BookOpen size={20} />, label: 'Rules Hub', path: '/rules' },
    { icon: <FlaskConical size={20} />, label: 'Simulator', path: '/simulator' },
    { icon: <FolderLock size={20} />, label: 'Audit Vault', path: '/audit' },
  ];

  const displayTitle = title || `Welcome back, ${user?.name?.split(' ')[0] || 'Nomad'}`;
  const displaySubtitle = subtitle || "Here's your intelligence summary for today.";

  return (
    <div className="layout-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sidebar */}
      <aside className="sidebar-continuous" style={{
        width: '280px',
        padding: '1.15rem 2rem 2rem',
      }}>
        <div className="logo" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '3.5rem',
          fontSize: '1.6rem',
          fontWeight: 800,
        }}>
          <img src="/taxes.png" alt="Logo" className="logo-img" style={{ height: '32px' }} />
          <span className="text-gradient">NomadTax</span>
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {menuItems.map((item) => (
              <NavItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                active={location.pathname === item.path}
              />
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              gap: '12px',
              color: 'var(--text-dim)',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
            <LogOut size={20} />
            Sign Out
          </button>

          <div className="sidebar-user-info" style={{
            marginTop: '1.25rem',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderTop: '1px solid var(--glass-border)',
            paddingTop: '1.25rem'
          }}>
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Avatar" 
                style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} 
              />
            ) : (
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                background: 'var(--gradient-main)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {user?.email?.[0].toUpperCase() || 'N'}
              </div>
            )}
            <div style={{ overflow: 'hidden' }}>
              <p style={{ 
                fontSize: '0.85rem', 
                fontWeight: 600, 
                color: 'var(--text-main)', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '1.25rem 3.5rem', overflowY: 'auto' }}>
        {/* Unified Search Row */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Search intelligence & movements..."
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 2.75rem',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)',
                background: 'white',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)'
              }}
            />
          </div>
        </div>

        {/* Global Divider Line */}
        <div style={{
          width: 'calc(100% + 7rem)',
          height: '1px',
          background: 'rgba(0,0,0,0.06)',
          marginLeft: '-3.5rem',
          marginBottom: '1.4rem'
        }} />

        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.6rem' }}>
          <div style={{ flexShrink: 0 }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{displayTitle}</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>{displaySubtitle}</p>
          </div>

          {onAddClick && (
            <button className="btn btn-primary"
              onClick={onAddClick}
              style={{ flexShrink: 0 }}
            >
              Add New Stay
            </button>
          )}
        </header>

        {children}
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, path, active }) => (
  <li>
    <Link to={path} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 14px',
      borderRadius: '8px',
      color: active ? '#0f172a' : 'var(--text-dim)',
      background: active ? '#e2e8f0' : 'transparent',
      textDecoration: 'none',
      fontWeight: active ? 600 : 500,
      transition: 'all 0.2s ease',
      border: 'none'
    }}>
      <span style={{ color: active ? '#0f172a' : 'inherit', display: 'flex', alignItems: 'center' }}>{icon}</span>
      {label}
    </Link>
  </li>
);

export default Layout;
