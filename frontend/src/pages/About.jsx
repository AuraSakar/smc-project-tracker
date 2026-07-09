import React from 'react';
import { useTranslation } from 'react-i18next';
import './About.css';

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="about-page page-wrapper container">
      <div className="about-card card">
        <div className="about-header">
          <img src="/favicon_smc.png" alt="SMC Logo" className="about-logo" />
          <h1>{t('About SMC Project Tracker')}</h1>
          <p className="text-muted">{t('Solapur Municipal Corporation')}, {t('Government of Maharashtra')}</p>
        </div>
        
        <div className="about-content">
          <section className="about-section">
            <h2>{t('Our Mission')}</h2>
            <p>{t('Mission Text')}</p>
          </section>

          <section className="about-section">
            <h2>{t('What We Track')}</h2>
            <p>{t('What We Track Text')}</p>
            <ul>
              <li><strong>{t('Road Construction & Maintenance')}:</strong> {t('Road Construction Text')}</li>
              <li><strong>{t('Water Supply')}:</strong> {t('Water Supply Text')}</li>
              <li><strong>{t('Drainage & Sewage')}:</strong> {t('Drainage Text')}</li>
              <li><strong>{t('Parks & Recreation')}:</strong> {t('Parks Text')}</li>
              <li><strong>{t('Public Building')}:</strong> {t('Public Buildings Text')}</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>{t('Contact Us')}</h2>
            <p>{t('Contact Us Text')}</p>
            <div className="contact-info">
              <p><i className="fas fa-map-marker-alt"></i> <strong>{t('Address')}:</strong> Rajwada Chowk, Solapur - 413002</p>
              <p><i className="fas fa-phone"></i> <strong>{t('Phone')}:</strong> 0217-2735293</p>
              <p><i className="fas fa-envelope"></i> <strong>{t('Email')}:</strong> info@solapurcorporation.gov.in</p>
              <p><i className="fas fa-globe"></i> <strong>{t('Website')}:</strong> <a href="https://www.solapurcorporation.gov.in" target="_blank" rel="noopener noreferrer">solapurcorporation.gov.in</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
