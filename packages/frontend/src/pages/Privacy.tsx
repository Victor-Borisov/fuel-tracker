import React from 'react';
import { Link } from 'react-router-dom';

export const Privacy: React.FC = () => {
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
        <h1>Privacy Policy</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Last updated: January 2025</p>

        <section style={{ marginTop: '2rem' }}>
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when using Fuel Tracker:
          </p>
          <ul>
            <li><strong>Account Information:</strong> Email address, optional display name</li>
            <li><strong>Vehicle Data:</strong> Vehicle details (make, model, year, fuel type)</li>
            <li><strong>Fuel Entry Data:</strong> Fill-up records including date, odometer, station, fuel details, quantity, and costs</li>
            <li><strong>Preferences:</strong> Currency, distance units, volume units, timezone</li>
          </ul>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Calculate and display fuel consumption statistics</li>
            <li>Authenticate your account and secure your data</li>
            <li>Respond to your comments, questions, and customer service requests</li>
            <li>Send you technical notices and support messages</li>
          </ul>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>3. Information Sharing and Disclosure</h2>
          <p>
            We do not share, sell, or rent your personal information to third parties. We may disclose your
            information only in the following circumstances:
          </p>
          <ul>
            <li>With your explicit consent</li>
            <li>To comply with legal obligations or valid legal process</li>
            <li>To protect the rights, property, or safety of Fuel Tracker, our users, or the public</li>
          </ul>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information:
          </p>
          <ul>
            <li>Passwords are hashed using industry-standard bcrypt algorithm</li>
            <li>Sessions are secured with HTTP-only, Secure cookies</li>
            <li>Data isolation ensures users can only access their own data</li>
            <li>Regular security updates and monitoring</li>
          </ul>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as needed to provide
            you services. You may request deletion of your account and all associated data at any time through
            the Settings page.
          </p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>6. Your Rights (GDPR)</h2>
          <p>
            If you are located in the European Economic Area, you have certain rights regarding your personal data:
          </p>
          <ul>
            <li><strong>Right of Access:</strong> You can view all your data in the application</li>
            <li><strong>Right to Rectification:</strong> You can edit your data at any time</li>
            <li><strong>Right to Erasure:</strong> You can delete your account and all data</li>
            <li><strong>Right to Data Portability:</strong> You can export your data in CSV format</li>
            <li><strong>Right to Object:</strong> You can contact us to object to data processing</li>
          </ul>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>7. Cookies</h2>
          <p>
            We use session cookies to keep you logged in. These cookies are essential for the service to function
            and expire when you log out or close your browser.
          </p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>8. Children's Privacy</h2>
          <p>
            Fuel Tracker is not intended for users under the age of 13. We do not knowingly collect personal
            information from children under 13.
          </p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting
            the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@fueltracker.example.com
          </p>
        </section>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #dee2e6' }}>
          <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </main>
    </div>
  );
};
