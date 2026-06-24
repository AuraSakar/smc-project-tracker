import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-col">
          <Link to="/login" className="footer-logo-area">
            <img src="/favicon_smc.png" alt="SMC Logo" className="footer-logo" />
            <h3>Solapur Municipal Corporation</h3>
          </Link>
          <p>Rajwada Chowk, Solapur - 413002</p>
          <p><i className="fas fa-phone"></i> 0217-2735293</p>
          <p><i className="fas fa-envelope"></i> info@solapurcorporation.gov.in</p>
        </div>
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/?category=All">All Projects</Link></li>
            <li><Link to="/login">Admin Login</Link></li>
            <li><a href="https://www.solapurcorporation.gov.in" target="_blank" rel="noopener noreferrer">Contact SMC</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>About this Portal</h3>
          <p>This is the official project tracking portal of Solapur Municipal Corporation. Citizens can track all civic development projects in real-time.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2024 Solapur Municipal Corporation | Maharashtra Government | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}