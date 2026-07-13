import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, planned: 0 });
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allRes = await api.get('/projects', { params: { limit: 100 } });
        const projects = allRes.data.projects;
        setStats({
          total: allRes.data.total,
          completed: projects.filter((p) => p.status === 'Completed').length,
          inProgress: projects.filter((p) => p.status === 'In Progress').length,
          planned: projects.filter((p) => p.status === 'Planned').length,
        });
        setRecentProjects(projects.slice(0, 5));
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard">
        
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}</h1>
          <p>{user?.department} • {user?.role === 'superadmin' ? 'Super Administrator' : 'Administrator'}</p>
        </div>

        <div className="stats-grid">
          <div className="dash-stat">
            <div className="dash-stat-icon"><i className="fas fa-folder-open"></i></div>
            <div className="dash-stat-info">
              <span className="dash-num">{stats.total}</span>
              <span>Total Projects</span>
            </div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-icon"><i className="fas fa-check-circle"></i></div>
            <div className="dash-stat-info">
              <span className="dash-num">{stats.completed}</span>
              <span>Completed</span>
            </div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-icon"><i className="fas fa-spinner"></i></div>
            <div className="dash-stat-info">
              <span className="dash-num">{stats.inProgress}</span>
              <span>In Progress</span>
            </div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-icon"><i className="fas fa-clipboard-list"></i></div>
            <div className="dash-stat-info">
              <span className="dash-num">{stats.planned}</span>
              <span>Planned</span>
            </div>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="recent-section">
            <h2>
              <span><i className="fas fa-clock" style={{marginRight: '8px'}}></i> Recent Activity</span>
            </h2>
            {recentProjects.length > 0 ? (
              <div className="recent-list">
                {recentProjects.map((p) => (
                  <div key={p._id} className="recent-item">
                    <span className="recent-title">{p.title}</span>
                    <span className="recent-status" style={{
                      color: p.status === 'Completed' ? 'var(--color-green)' : p.status === 'In Progress' ? 'var(--color-accent)' : 'inherit'
                    }}>{p.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No recent activity.</p>
            )}
          </div>

          <div className="dashboard-actions-card">
            <h2><i className="fas fa-bolt" style={{marginRight: '8px'}}></i> Quick Actions</h2>
            <div className="quick-actions">
              <button className="btn btn-primary" onClick={() => navigate('/admin/projects/add')}>
                <i className="fas fa-plus"></i> Add New Project
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/admin/projects')}>
                <i className="fas fa-tasks"></i> Manage Projects
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/')}>
                <i className="fas fa-external-link-alt"></i> View Public Site
              </button>
            </div>
          </div>
        </div>

    </div>
  );
}