import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './DepartmentLogin.css';

export default function DepartmentLogin() {
  const { t } = useTranslation();

  return (
    <div className="login-page page-wrapper">
      <div className="login-card department-login-card">
        <div className="logonew-section">
          <div className="logonew">
            <i className="fas fa-building"></i>
          </div>
          <h2>{t('Department Login')}</h2>
        </div>
        
        <div className="coming-soon-message">
          <h3>{t('Coming Soon')}</h3>
          <p>{t('The department login portal is currently under development. Please check back later.')}</p>
        </div>
        
        <Link to="/login" className="btn btn-primary login-btn" style={{ textAlign: 'center', textDecoration: 'none' }}>
          {t('Back to Login Selector')}
        </Link>
      </div>
    </div>
  );
}
