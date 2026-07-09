import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-col">
          <Link to="/login" className="footer-logo-area" target="_blank" rel="noopener noreferrer">
            <img src="/favicon_smc.png" alt="SMC Logo" className="footer-logo" />
            <h3>{t('Solapur Municipal Corporation')}</h3>
          </Link>
          <p>{t('Address')}</p>
          <p><i className="fas fa-phone"></i> 0217-2735293</p>
          <p><i className="fas fa-envelope"></i> info@solapurcorporation.gov.in</p>
        </div>
        <div className="footer-col">
          <h3>{t('Quick Links')}</h3>
          <ul>
            <li><Link to="/">{t('Home')}</Link></li>
            <li><Link to="/?category=All">{t('All Projects')}</Link></li>
            <li><a href="https://www.solapurcorporation.gov.in" target="_blank" rel="noopener noreferrer">{t('Contact SMC')}</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>{t('About this Portal')}</h3>
          <p>{t('Footer About')}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>{t('Footer Copyright')}</p>
        </div>
      </div>
    </footer>
  );
}