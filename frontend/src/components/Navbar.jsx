import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="logo-area">
            <img src="/favicon_smc.png" alt="SMC Logo" className="smc-logo" />
            <div>
              <span className="smc-title">सोलापूर महानगरपालिका</span>
              <span className="govt-text">Government of Maharashtra</span>
            </div>
          </div>
          <div className="top-bar-right">
            <a href="https://www.solapurcorporation.gov.in" target="_blank" rel="noopener noreferrer">SMC Website</a>
          </div>
        </div>
      </div>
      <nav className="main-nav">
        <div className="container nav-content">
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <i className="fas fa-bars"></i>
          </button>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/projects" onClick={() => setMenuOpen(false)}>All Projects</Link></li>
            <li className="dropdown">
              <span>Categories <i className="fas fa-chevron-down"></i></span>
              <ul className="dropdown-menu">
                <li><Link to="/projects?category=Road" onClick={() => setMenuOpen(false)}>Roads</Link></li>
                <li><Link to="/projects?category=Water Supply" onClick={() => setMenuOpen(false)}>Water Supply</Link></li>
                <li><Link to="/projects?category=Drainage" onClick={() => setMenuOpen(false)}>Drainage</Link></li>
                <li><Link to="/projects?category=Parks" onClick={() => setMenuOpen(false)}>Parks</Link></li>
                <li><Link to="/projects?category=Public Buildings" onClick={() => setMenuOpen(false)}>Public Buildings</Link></li>
              </ul>
            </li>
            <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/admin/dashboard">Admin Panel</Link></li>
                <li><span className="nav-user">{user?.name}</span></li>
                <li><button className="btn btn-primary btn-sm" onClick={handleLogout}>Logout</button></li>
              </>
            ) : null}
          </ul>
        </div>
      </nav>
    </header>
  );
}