import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import './ProjectList.css';

export default function ProjectList() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects', { params: { limit: 100 } }); // Fetch more for the list
        setProjects(res.data.projects);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="project-list-page">
      <div className="project-list-header">
        <h2>{t('Projects')}</h2>
      </div>

      {loading ? (
        <p>{t('Loading...')}</p>
      ) : projects.length === 0 ? (
        <p>{t('No projects found')}</p>
      ) : (
        <table className="project-list-table">
          <thead>
            <tr>
              <th>{t('Project Title')}</th>
              <th>{t('Category')}</th>
              <th>{t('Status')}</th>
              <th style={{ width: '60px', textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>
                  <div className="project-title-col">
                    <span className="project-id-badge">{project.projectId}</span>
                    <strong>{project.title}</strong>
                  </div>
                </td>
                <td>{t(project.category)}</td>
                <td>{t(project.status)}</td>
                <td style={{ textAlign: 'center' }}>
                  <Link 
                    to={`/admin/projects?search=${project.projectId}`} 
                    className="project-menu-btn"
                    title={t('Manage Project')}
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
