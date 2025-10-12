import React from 'react';
import { Link } from 'react-router-dom';

export const Landing: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        padding: '1rem 2rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, color: '#007bff' }}>Fuel Tracker</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" style={{
            padding: '0.5rem 1rem',
            textDecoration: 'none',
            color: '#007bff',
            border: '1px solid #007bff',
            borderRadius: '4px',
          }}>
            Sign In
          </Link>
          <Link to="/register" style={{
            padding: '0.5rem 1rem',
            textDecoration: 'none',
            color: 'white',
            backgroundColor: '#007bff',
            border: '1px solid #007bff',
            borderRadius: '4px',
          }}>
            Sign Up
          </Link>
        </div>
      </header>

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#f8f9fa',
      }}>
        <div style={{ maxWidth: '800px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#333' }}>
            Track Your Fuel Consumption
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#6c757d', marginBottom: '2rem' }}>
            Monitor fuel fill-ups, analyze consumption patterns, and optimize your vehicle costs over time.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '3rem',
            textAlign: 'left',
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ color: '#007bff', marginTop: 0 }}>Track Fill-ups</h3>
              <p style={{ color: '#6c757d' }}>
                Record every fuel fill-up with details like station, brand, grade, quantity, and cost.
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ color: '#007bff', marginTop: 0 }}>Analyze Consumption</h3>
              <p style={{ color: '#6c757d' }}>
                View detailed statistics on fuel consumption (L/100km or MPG), costs per kilometer, and more.
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ color: '#007bff', marginTop: 0 }}>Multi-Vehicle Support</h3>
              <p style={{ color: '#6c757d' }}>
                Manage multiple vehicles and compare their performance side by side.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <Link to="/register" style={{
              display: 'inline-block',
              padding: '1rem 3rem',
              fontSize: '1.25rem',
              textDecoration: 'none',
              color: 'white',
              backgroundColor: '#007bff',
              borderRadius: '4px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}>
              Get Started Free
            </Link>
          </div>
        </div>
      </main>

      <footer style={{
        padding: '2rem',
        backgroundColor: '#343a40',
        color: 'white',
        textAlign: 'center',
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link to="/terms" style={{ color: 'white', marginRight: '2rem', textDecoration: 'none' }}>
            Terms of Service
          </Link>
          <Link to="/privacy" style={{ color: 'white', textDecoration: 'none' }}>
            Privacy Policy
          </Link>
        </div>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#adb5bd' }}>
          © 2025 Fuel Tracker. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
