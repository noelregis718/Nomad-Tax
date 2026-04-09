import { Globe, Plane, Clock, User, LogOut, LayoutDashboard, Map, FlaskConical, FolderLock, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Layout = ({ children, onAddClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Clock size={20} />, label: 'History', path: '/history' },
    { icon: <BookOpen size={20} />, label: 'Rules Hub', path: '/rules' },
    { icon: <FlaskConical size={20} />, label: 'Simulator', path: '/simulator' },
    { icon: <FolderLock size={20} />, label: 'Audit Vault', path: '/audit' },
  ];

  return (
    <div className="layout-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sidebar */}
      <aside className="glass-card" style={{
        width: '280px',
        margin: '1rem',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '1.5rem',
        border: '1px solid var(--glass-border)'
      }}>
        <div className="logo" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '3rem',
          fontSize: '1.6rem',
          fontWeight: 800,
        }}>
          <Globe size={28} className="text-blue" />
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
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Welcome back, {user?.name?.split(' ')[0] || 'Nomad'}</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Here's your intelligence summary for today.</p>
          </div>
          <button className="btn btn-primary" 
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

const NavItem = ({ icon, label, path, active }) => (
  <li>
    <Link to={path} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px',
      borderRadius: '14px',
      color: active ? 'white' : 'var(--text-dim)',
      background: active ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
      textDecoration: 'none',
      fontWeight: 500,
      transition: 'all 0.2s ease',
      border: active ? '1px solid rgba(37, 99, 235, 0.2)' : '1px solid transparent'
    }}>
      <span style={{ color: active ? '#60a5fa' : 'inherit' }}>{icon}</span>
      {label}
    </Link>
  </li>
);

export default Layout;
