import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { formatINR, formatDate } from '../utils/format';
import './ProjectDetail.css';

const categoryIcons = {
  Road: 'fa-road', 'Water Supply': 'fa-water', Drainage: 'fa-water',
  'Park/Garden': 'fa-tree', Building: 'fa-building', Electricity: 'fa-bolt', Other: 'fa-tasks',
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then((res) => setProject(res.data.project))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-wrapper text-center">Loading...</div>;
  if (!project) return <div className="page-wrapper text-center">Project not found</div>;

  const remaining = project.estimatedCost - project.amountSpent;

  return (
    <div className="project-detail page-wrapper container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> &gt; <Link to="/">Projects</Link> &gt; {project.title}
      </div>

      <div className="detail-header">
        <span className="project-id-badge">{project.projectId}</span>
        <h1>{project.title}</h1>
        <div className="detail-badges">
          <span className="badge" style={{ background: 'rgba(232,119,34,0.1)', color: 'var(--color-accent)' }}>
            <i className={`fas ${categoryIcons[project.category]}`}></i> {project.category}
          </span>
          <span className="badge" style={{ background: 'var(--color-primary)', color: '#fff' }}>{project.ward}</span>
          <StatusBadge status={project.status} />
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-left">
          <h3>Description</h3>
          <p>{project.description}</p>

          <h3>Location</h3>
          <p><i className="fas fa-map-marker-alt"></i> {project.fromLocation}{project.toLocation ? ` → ${project.toLocation}` : ''}</p>

          <h3>Timeline</h3>
          <p><strong>Start Date:</strong> {formatDate(project.startDate)}</p>
          <p><strong>Expected Completion:</strong> {formatDate(project.expectedCompletionDate)}</p>
          {project.actualCompletionDate && <p><strong>Actual Completion:</strong> {formatDate(project.actualCompletionDate)}</p>}

          {project.contractor && (
            <>
              <h3>Contractor</h3>
              <p>{project.contractor}</p>
            </>
          )}
        </div>

        <div className="detail-right">
          <div className="progress-card">
            <h3>Progress</h3>
            <div className="big-progress-bar">
              <div className="big-progress-fill" style={{ width: `${project.completionPercent}%` }}></div>
            </div>
            <span className="big-progress-text">{project.completionPercent}% Complete</span>
          </div>

          <div className="budget-card">
            <h3>Budget</h3>
            <div className="budget-row"><span>Estimated Cost</span><strong>{formatINR(project.estimatedCost)}</strong></div>
            <div className="budget-row"><span>Amount Spent</span><strong>{formatINR(project.amountSpent)}</strong></div>
            <div className="budget-row"><span>Remaining</span><strong className={remaining < 0 ? 'text-danger' : ''}>{formatINR(remaining)}</strong></div>
          </div>

          {project.officials?.length > 0 && (
            <div className="officials-card">
              <h3>Officials in Charge</h3>
              {project.officials.map((off, i) => (
                <div key={i} className="official-card">
                  <p><i className="fas fa-user-tie"></i> <strong>{off.name}</strong></p>
                  <p>{off.designation}</p>
                  {off.department && <p className="text-muted">{off.department}</p>}
                  {off.contactNumber && <p className="text-muted">{off.contactNumber}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="map-section">
        <h3>Location Map</h3>
        {project.latitude && project.longitude ? (
          <iframe
            src={`https://www.google.com/maps?q=${project.latitude},${project.longitude}&output=embed`}
            width="100%" height="350" style={{ border: 0 }} allowFullScreen
          ></iframe>
        ) : project.googleMapsLink ? (
          <a href={project.googleMapsLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <i className="fas fa-map-marker-alt"></i> View on Google Maps
          </a>
        ) : (
          <div className="map-placeholder"><p>Map not available</p></div>
        )}
      </div>

      {project.updates?.length > 0 && (
        <div className="updates-section">
          <h3>Project Updates</h3>
          <div className="timeline">
            {project.updates.map((u, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-date">{formatDate(u.date)}</div>
                <div className="timeline-content">
                  <p>{u.note}</p>
                  {u.updatedBy && <small className="text-muted">— {u.updatedBy}</small>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.images?.length > 0 && (
        <div className="images-section">
          <h3>Images</h3>
          <div className="image-grid">
            {project.images.map((img, i) => (
              <img key={i} src={img} alt={`Project ${i + 1}`} onClick={() => setLightboxImg(img)} />
            ))}
          </div>
        </div>
      )}

      {lightboxImg && (
        <div className="lightbox" onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="enlarged" />
        </div>
      )}

      {project.documents?.length > 0 && (
        <div className="documents-section">
          <h3>Documents</h3>
          {project.documents.map((doc, i) => (
            <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" className="doc-link">
              <i className="fas fa-file"></i> {doc.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}