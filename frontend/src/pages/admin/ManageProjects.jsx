import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import ProjectTable from '../../components/ProjectTable';
import './ManageProjects.css';

export default function ManageProjects() {
  const { isSuperAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [search, setSearch] = useState(queryParams.get('search') || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [updateNote, setUpdateNote] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (category) params.category = category;
      if (status) params.status = status;
      if (search) params.search = search;
      const res = await api.get('/projects', { params });
      setProjects(res.data.projects);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, [page, category, status]);

  const handleSearch = (e) => { e.preventDefault(); fetchProjects(); };

  const confirmDelete = (p) => {
    setDeleteTarget(p);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/projects/${deleteTarget._id}`);
      toast.success('Project deleted successfully');
      setShowDeleteModal(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const confirmUpdate = (p) => {
    setUpdateTarget(p);
    setUpdateNote('');
    setShowUpdateModal(true);
  };

  const handleAddUpdate = async () => {
    if (!updateNote.trim()) return toast.error('Please enter an update note');
    try {
      await api.post(`/projects/${updateTarget._id}/updates`, { note: updateNote });
      toast.success('Update added successfully');
      setShowUpdateModal(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add update');
    }
  };

  return (
    <div className="manage-projects">
        <h1>Manage Projects</h1>

        <div className="manage-filters">
          <form onSubmit={handleSearch} className="search-form">
            <input placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button type="submit" className="btn btn-primary"><i className="fas fa-search"></i></button>
          </form>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            <option value="Road">Road</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Drainage">Drainage</option>
            <option value="Park/Garden">Park/Garden</option>
            <option value="Building">Building</option>
            <option value="Electricity">Electricity</option>
            <option value="Other">Other</option>
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="Planned">Planned</option>
            <option value="Tender Issued">Tender Issued</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <ProjectTable projects={projects} onDelete={confirmDelete} onAddUpdate={confirmUpdate} isSuperAdmin={isSuperAdmin} />
            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            )}
          </>
        )}

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete project <strong>{deleteTarget?.projectId}</strong>? This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Progress Update</h3>
            <p>For: <strong>{updateTarget?.title}</strong></p>
            <textarea rows="4" value={updateNote} onChange={(e) => setUpdateNote(e.target.value)} placeholder="Enter update details..." />
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowUpdateModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddUpdate}>Add Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}