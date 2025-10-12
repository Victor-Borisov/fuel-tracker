import React from 'react';
import { Link } from 'react-router-dom';

export const Terms: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <header style={{
        padding: '1rem 2rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Fuel Tracker
        </Link>
      </header>

      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', backgroundColor: 'white', borderRadius: '8px' }}>
        <h1>Terms of Service</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Last updated: January 2025</p>

        <section style={{ marginTop: '2rem' }}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Fuel Tracker, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily use Fuel Tracker for personal, non-commercial purposes only.
            This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained in Fuel Tracker</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>3. User Account</h2>
          <p>
            To use certain features of the service, you must register for an account. You are responsible for:
          </p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
          </ul>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>4. User Data</h2>
          <p>
            You retain all rights to the data you input into Fuel Tracker. We will not share your personal data
            with third parties without your consent, except as required by law.
          </p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>5. Service Availability</h2>
          <p>
            We strive to maintain service availability but do not guarantee uninterrupted access. The service
            is provided "as is" without warranties of any kind.
          </p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>6. Account Termination</h2>
          <p>
            You may delete your account at any time through the Settings page. Upon deletion, all your data
            will be permanently removed from our servers.
          </p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>7. Limitation of Liability</h2>
          <p>
            Fuel Tracker shall not be liable for any indirect, incidental, special, consequential, or punitive
            damages resulting from your use or inability to use the service.
          </p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material changes
            via email or through the service.
          </p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>9. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@fueltracker.example.com
          </p>
        </section>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #dee2e6' }}>
          <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </main>
    </div>
  );
};
