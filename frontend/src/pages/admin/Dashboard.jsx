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
    <div className="dashboard page-wrapper">
      <div className="container">
        <div className="welcome-section">
          <h1>Welcome, {user?.name}</h1>
          <p className="text-muted">{user?.department} | {user?.role}</p>
        </div>

        <div className="stats-grid">
          <div className="dash-stat"><span className="dash-num">{stats.total}</span><span>Total Projects</span></div>
          <div className="dash-stat"><span className="dash-num">{stats.completed}</span><span>Completed</span></div>
          <div className="dash-stat"><span className="dash-num">{stats.inProgress}</span><span>In Progress</span></div>
          <div className="dash-stat"><span className="dash-num">{stats.planned}</span><span>Planned</span></div>
        </div>

        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => navigate('/admin/projects/add')}>
            <i className="fas fa-plus"></i> Add New Project
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/projects')}>
            <i className="fas fa-list"></i> Manage Projects
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/')}>
            <i className="fas fa-eye"></i> View Public Site
          </button>
        </div>

        {recentProjects.length > 0 && (
          <div className="recent-section">
            <h2>Recent Activity</h2>
            {recentProjects.map((p) => (
              <div key={p._id} className="recent-item">
                <span className="recent-title">{p.title}</span>
                <span className="recent-status" style={{
                  color: p.status === 'Completed' ? 'var(--color-green)' : p.status === 'In Progress' ? 'var(--color-accent)' : 'inherit'
                }}>{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}