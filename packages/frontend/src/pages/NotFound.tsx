import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '6rem', margin: 0, color: '#007bff' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginTop: '1rem', color: '#333' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.25rem', color: '#6c757d', marginTop: '1rem', textAlign: 'center' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          marginTop: '2rem',
          padding: '0.75rem 2rem',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '1.1rem',
        }}
      >
        Go Back Home
      </Link>
    </div>
  );
};
