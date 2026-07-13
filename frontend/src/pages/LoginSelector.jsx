import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './LoginSelector.css';

export default function LoginSelector() {
  const { t } = useTranslation();

  return (
    <div className="login-selector-page page-wrapper">
      <div className="login-selector-container">
        <div className="login-selector-header">
          <h1>{t('Portal Login')}</h1>
          <p>{t('Select your portal to continue')}</p>
        </div>

        <div className="login-selector-cards">
          <Link to="/login/admin" className="login-selector-card">
            <div className="login-selector-icon">
              <i className="fas fa-user-shield"></i>
            </div>
            <h2>{t('Admin Login')}</h2>
            <p>{t('Access the main project management dashboard (Superadmin & Admins).')}</p>
            <button className="btn btn-primary login-selector-btn">{t('Go to Admin Login')}</button>
          </Link>

          <Link to="/login/department" className="login-selector-card">
            <div className="login-selector-icon">
              <i className="fas fa-building"></i>
            </div>
            <h2>{t('Department Login')}</h2>
            <p>{t('Access department-specific tools and updates.')}</p>
            <button className="btn btn-primary login-selector-btn">{t('Go to Department Login')}</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
