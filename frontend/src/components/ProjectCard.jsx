import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatINR, formatDate } from '../utils/format';
import StatusBadge from './StatusBadge';
import './ProjectCard.css';

const categoryIcons = {
  'Road': 'fa-road',
  'Water Supply': 'fa-water',
  'Drainage': 'fa-water',
  'Park/Garden': 'fa-tree',
  'Building': 'fa-building',
  'Electricity': 'fa-bolt',
  'Other': 'fa-tasks',
};

export default function ProjectCard({ project }) {
  const { t } = useTranslation();
  return (
    <Link to={`/projects/${project._id}`} className="project-card card">
      <div className="card-header">
        <div className="category-icon">
          <i className={`fas ${categoryIcons[project.category] || 'fa-tasks'}`}></i>
        </div>
        <StatusBadge status={project.status} />
      </div>
      <h3 className="card-title">{project.title}</h3>
      <span className="ward-badge">{project.ward}</span>
      {project.fromLocation && (
        <p className="card-location">
          <i className="fas fa-map-marker-alt"></i> {project.fromLocation}
          {project.toLocation && ` → ${project.toLocation}`}
        </p>
      )}
      <p className="card-deadline">
        <i className="fas fa-calendar-alt"></i> {t('Expected')}: {formatDate(project.expectedCompletionDate)}
      </p>
      <div className="progress-section">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${project.completionPercent}%` }}></div>
        </div>
        <span className="progress-text">{project.completionPercent}%</span>
      </div>
      <p className="card-budget">{formatINR(project.estimatedCost)}</p>
      <span className="view-details">{t('View Details')} <i className="fas fa-arrow-right"></i></span>
    </Link>
  );
}