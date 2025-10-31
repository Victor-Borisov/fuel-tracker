import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
            Fuel Tracker
          </Link>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/vehicles" style={{ color: 'white', textDecoration: 'none' }}>Vehicles</Link>
          <Link to="/fuel-entries" style={{ color: 'white', textDecoration: 'none' }}>Fuel Entries</Link>
          <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span>{user?.displayName || user?.email}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '20px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        {children}
      </main>

      <footer style={{
        backgroundColor: '#f5f5f5',
        padding: '15px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        Fuel Tracker © 2025
      </footer>
    </div>
  );
};
