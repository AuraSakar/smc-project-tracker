import React from 'react';
import './About.css';

export default function About() {
  return (
    <div className="about-page page-wrapper container">
      <div className="about-card card">
        <div className="about-header">
          <img src="/favicon_smc.png" alt="SMC Logo" className="about-logo" />
          <h1>About SMC Project Tracker</h1>
          <p className="text-muted">Solapur Municipal Corporation, Government of Maharashtra</p>
        </div>
        
        <div className="about-content">
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              The Solapur Municipal Corporation (SMC) is committed to transparency, efficiency, 
              and citizen engagement. The <strong>SMC Project Tracker</strong> is an official 
              initiative to provide citizens with real-time visibility into civic development 
              projects happening across our city.
            </p>
          </section>

          <section className="about-section">
            <h2>What We Track</h2>
            <p>
              This portal tracks all major infrastructure and civic projects, including but not limited to:
            </p>
            <ul>
              <li><strong>Road Construction & Maintenance:</strong> Improving city connectivity and safety.</li>
              <li><strong>Water Supply:</strong> Expanding and maintaining drinking water networks.</li>
              <li><strong>Drainage & Sewage:</strong> Upgrading sanitation infrastructure.</li>
              <li><strong>Parks & Recreation:</strong> Developing green spaces for public wellbeing.</li>
              <li><strong>Public Buildings:</strong> Constructing community halls, hospitals, and schools.</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Contact Us</h2>
            <p>If you have any questions or feedback regarding civic projects, please reach out to us:</p>
            <div className="contact-info">
              <p><i className="fas fa-map-marker-alt"></i> <strong>Address:</strong> Rajwada Chowk, Solapur - 413002</p>
              <p><i className="fas fa-phone"></i> <strong>Phone:</strong> 0217-2735293</p>
              <p><i className="fas fa-envelope"></i> <strong>Email:</strong> info@solapurcorporation.gov.in</p>
              <p><i className="fas fa-globe"></i> <strong>Website:</strong> <a href="https://www.solapurcorporation.gov.in" target="_blank" rel="noopener noreferrer">solapurcorporation.gov.in</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
