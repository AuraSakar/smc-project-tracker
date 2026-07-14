import { useNavigate } from 'react-router-dom';
import { formatINR, formatDate } from '../utils/format';
import StatusBadge from './StatusBadge';
import './ProjectTable.css';

export default function ProjectTable({ projects, onDelete, onAddUpdate, isSuperAdmin }) {
  const navigate = useNavigate();

  return (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Ward</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p._id}>
              <td>{p.projectId}</td>
              <td>{p.title}</td>
              <td>{p.category}</td>
              <td>{p.ward}</td>
              <td><StatusBadge status={p.status} /></td>
              <td>{formatDate(p.startDate)}</td>
              <td>{formatDate(p.expectedCompletionDate)}</td>
              <td>
                <div className="actions-cell">
                  <button className="btn-icon" title="Edit" onClick={() => navigate(`/admin/projects/edit/${p._id}`)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="btn-icon" title="Add Update" onClick={() => onAddUpdate(p)}>
                    <i className="fas fa-plus"></i>
                  </button>
                  {isSuperAdmin && (
                    <button className="btn-icon btn-icon-danger" title="Delete" onClick={() => onDelete(p)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}