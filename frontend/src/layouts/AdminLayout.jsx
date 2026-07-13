import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import A11yBar from '../components/A11yBar';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <A11yBar />
      
      <header className="admin-header">
        <div className="admin-header-left">
          <img src="/favicon_smc.png" alt="SMC Logo" className="admin-header-logo" />
          <div className="admin-header-title">
            <h1>{t('Solapur Municipal Corporation')}</h1>
          </div>
        </div>
        
        <div className="admin-header-center">
          <h2>{t('Project Management System')}</h2>
        </div>
        
        <div className="admin-header-right">
          <button 
            className="user-dropdown-btn" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <i className="fas fa-user-circle"></i>
            {user?.name || 'Admin'}
            <i className="fas fa-chevron-down" style={{ fontSize: '0.8rem' }}></i>
          </button>
          
          {dropdownOpen && (
            <div className="user-dropdown-menu">
              <button onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> {t('Logout')}
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <NavLink to="/admin/dashboard" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-chart-line"></i> {t('Dashboard')}
          </NavLink>
          <NavLink to="/admin/projects-list" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-list"></i> {t('Projects')}
          </NavLink>
          <NavLink to="/admin/projects/add" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-plus-circle"></i> {t('Add new Project')}
          </NavLink>
          <NavLink to="/admin/projects" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-edit"></i> {t('Manage Projects')}
          </NavLink>
          <NavLink to="/admin/report" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <i className="fas fa-file-alt"></i> {t('Report')}
          </NavLink>
        </aside>

        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
