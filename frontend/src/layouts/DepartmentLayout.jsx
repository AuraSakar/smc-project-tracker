import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import A11yBar from '../components/A11yBar';
import './DepartmentLayout.css';

export default function DepartmentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dept-layout">
      <A11yBar />
      
      <header className="dept-header">
        <div className="dept-header-left">
          <img src="/favicon_smc.png" alt="SMC Logo" className="dept-header-logo" />
          <div className="dept-header-title">
            <h1>{t('Solapur Municipal Corporation')}</h1>
            <span className="dept-badge">{user?.department || t('Department Portal')}</span>
          </div>
        </div>
        
        <div className="dept-header-center">
          <h2>{t('Department Project Billing Portal')}</h2>
        </div>
        
        <div className="dept-header-right">
          <button 
            className="user-dropdown-btn" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <i className="fas fa-building"></i>
            {user?.name || t('Department')}
            <i className="fas fa-chevron-down" style={{ fontSize: '0.8rem' }}></i>
          </button>
          
          {dropdownOpen && (
            <div className="user-dropdown-menu">
              <button onClick={() => navigate('/')}>
                <i className="fas fa-globe"></i> {t('View Public Site')}
              </button>
              <button onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> {t('Logout')}
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="dept-body">
        <aside className="dept-sidebar">
          <NavLink to="/department/dashboard" className={({ isActive }) => `dept-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-file-invoice-dollar"></i> {t('Manage Project Bills')}
          </NavLink>
          <NavLink to="/" className="dept-nav-item">
            <i className="fas fa-eye"></i> {t('Public Website')}
          </NavLink>
        </aside>

        <main className="dept-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
