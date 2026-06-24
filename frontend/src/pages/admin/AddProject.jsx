import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import './ProjectForm.css';

const categories = ['Road', 'Water Supply', 'Drainage', 'Park/Garden', 'Building', 'Electricity', 'Other'];
const statuses = ['Planned', 'Tender Issued', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];
const wards = [...Array.from({ length: 48 }, (_, i) => `Ward No. ${i + 1}`), 'City-wide'];

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [officials, setOfficials] = useState([{ name: '', designation: '', department: '', contactNumber: '' }]);
  const [images, setImages] = useState(['']);
  const [documents, setDocuments] = useState([{ name: '', url: '' }]);
  const [updateNote, setUpdateNote] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.get(`/projects/${id}`)
        .then((res) => {
          const p = res.data.project;
          setValue('title', p.title);
          setValue('category', p.category);
          setValue('ward', p.ward);
          setValue('description', p.description);
          setValue('status', p.status);
          setValue('fromLocation', p.fromLocation);
          setValue('toLocation', p.toLocation || '');
          setValue('googleMapsLink', p.googleMapsLink || '');
          setValue('latitude', p.latitude || '');
          setValue('longitude', p.longitude || '');
          setValue('startDate', p.startDate?.split('T')[0]);
          setValue('expectedCompletionDate', p.expectedCompletionDate?.split('T')[0]);
          setValue('actualCompletionDate', p.actualCompletionDate?.split('T')[0] || '');
          setValue('completionPercent', p.completionPercent);
          setValue('estimatedCost', p.estimatedCost);
          setValue('amountSpent', p.amountSpent);
          setValue('contractor', p.contractor || '');
          setValue('isPublic', p.isPublic);
          if (p.officials?.length) setOfficials(p.officials);
          if (p.images?.length) setImages(p.images.length ? p.images : ['']);
          if (p.documents?.length) setDocuments(p.documents.length ? p.documents : [{ name: '', url: '' }]);
        })
        .catch((err) => { toast.error('Failed to load project'); navigate('/admin/projects'); })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, setValue, navigate]);

  const addOfficial = () => setOfficials([...officials, { name: '', designation: '', department: '', contactNumber: '' }]);
  const removeOfficial = (i) => setOfficials(officials.filter((_, idx) => idx !== i));
  const updateOfficial = (i, field, value) => {
    const updated = [...officials];
    updated[i][field] = value;
    setOfficials(updated);
  };

  const addImage = () => setImages([...images, '']);
  const removeImage = (i) => setImages(images.filter((_, idx) => idx !== i));
  const updateImage = (i, value) => {
    const updated = [...images];
    updated[i] = value;
    setImages(updated);
  };

  const addDocument = () => setDocuments([...documents, { name: '', url: '' }]);
  const removeDocument = (i) => setDocuments(documents.filter((_, idx) => idx !== i));
  const updateDocument = (i, field, value) => {
    const updated = [...documents];
    updated[i][field] = value;
    setDocuments(updated);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      data.officials = officials.filter((o) => o.name);
      data.images = images.filter((img) => img.trim());
      data.documents = documents.filter((d) => d.name && d.url);
      if (!data.actualCompletionDate) delete data.actualCompletionDate;
      if (!data.googleMapsLink) delete data.googleMapsLink;
      if (!data.latitude) delete data.latitude;
      if (!data.longitude) delete data.longitude;
      if (!data.contractor) delete data.contractor;
      if (!data.toLocation) delete data.toLocation;

      if (isEdit) {
        if (updateNote.trim()) {
          await api.post(`/projects/${id}/updates`, { note: updateNote, updatedBy: user?.name });
        }
        await api.put(`/projects/${id}`, data);
        toast.success('Project updated successfully');
      } else {
        await api.post('/projects', data);
        toast.success('Project created successfully');
      }
      navigate('/admin/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) return <div className="page-wrapper text-center">Loading...</div>;

  return (
    <div className="project-form-page page-wrapper">
      <div className="container">
        <h1>{isEdit ? 'Edit Project' : 'Add New Project'}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="project-form">
          <div className="form-section">
            <h2>Basic Info</h2>
            <div className="form-group">
              <label>Title *</label>
              <input {...register('title', { required: 'Title is required' })} />
              {errors.title && <p className="form-error">{errors.title.message}</p>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select {...register('category', { required: 'Category is required' })}>
                  <option value="">Select...</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Ward *</label>
                <select {...register('ward', { required: 'Ward is required' })}>
                  <option value="">Select...</option>
                  {wards.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea rows="4" {...register('description', { required: 'Description is required', minLength: { value: 50, message: 'Minimum 50 characters' } })} />
              {errors.description && <p className="form-error">{errors.description.message}</p>}
            </div>
            <div className="form-group">
              <label>Status</label>
              <select {...register('status')}>
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h2>Location</h2>
            <div className="form-row">
              <div className="form-group">
                <label>From Location *</label>
                <input {...register('fromLocation', { required: 'From location is required' })} />
              </div>
              <div className="form-group">
                <label>To Location</label>
                <input {...register('toLocation')} />
              </div>
            </div>
            <div className="form-group">
              <label>Google Maps Link</label>
              <input {...register('googleMapsLink')} placeholder="https://maps.google.com/?q=..." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Latitude</label>
                <input type="number" step="any" {...register('latitude')} />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input type="number" step="any" {...register('longitude')} />
              </div>
            </div>
            <p className="help-text">Tip: Open Google Maps, right-click on location, copy coordinates</p>
          </div>

          <div className="form-section">
            <h2>Timeline & Finance</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input type="date" {...register('startDate', { required: 'Start date is required' })} />
              </div>
              <div className="form-group">
                <label>Expected Completion *</label>
                <input type="date" {...register('expectedCompletionDate', { required: 'Expected completion is required' })} />
              </div>
              <div className="form-group">
                <label>Actual Completion</label>
                <input type="date" {...register('actualCompletionDate')} />
              </div>
            </div>
            <div className="form-group">
              <label>Completion %</label>
              <input type="range" min="0" max="100" {...register('completionPercent')} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Estimated Cost (₹) *</label>
                <input type="number" {...register('estimatedCost', { required: 'Estimated cost is required', min: { value: 1, message: 'Must be > 0' } })} />
              </div>
              <div className="form-group">
                <label>Amount Spent (₹)</label>
                <input type="number" {...register('amountSpent')} />
              </div>
            </div>
            <div className="form-group">
              <label>Contractor Name</label>
              <input {...register('contractor')} />
            </div>
          </div>

          <div className="form-section">
            <h2>Officials <button type="button" className="btn btn-outline btn-sm" onClick={addOfficial}><i className="fas fa-plus"></i> Add Official</button></h2>
            {officials.map((off, i) => (
              <div key={i} className="official-row">
                <input placeholder="Name" value={off.name} onChange={(e) => updateOfficial(i, 'name', e.target.value)} />
                <input placeholder="Designation" value={off.designation} onChange={(e) => updateOfficial(i, 'designation', e.target.value)} />
                <input placeholder="Department" value={off.department} onChange={(e) => updateOfficial(i, 'department', e.target.value)} />
                <input placeholder="Contact" value={off.contactNumber} onChange={(e) => updateOfficial(i, 'contactNumber', e.target.value)} />
                {officials.length > 1 && <button type="button" className="btn-icon-danger" onClick={() => removeOfficial(i)}><i className="fas fa-times"></i></button>}
              </div>
            ))}
          </div>

          <div className="form-section">
            <h2>Visibility</h2>
            <label className="toggle-label">
              <input type="checkbox" {...register('isPublic')} />
              Visible to Public
            </label>
          </div>

          <div className="form-section">
            <h2>Images <button type="button" className="btn btn-outline btn-sm" onClick={addImage}><i className="fas fa-plus"></i> Add Image URL</button></h2>
            {images.map((img, i) => (
              <div key={i} className="array-row">
                <input placeholder="Image URL" value={img} onChange={(e) => updateImage(i, e.target.value)} />
                {images.length > 1 && <button type="button" className="btn-icon-danger" onClick={() => removeImage(i)}><i className="fas fa-times"></i></button>}
              </div>
            ))}
          </div>

          <div className="form-section">
            <h2>Documents <button type="button" className="btn btn-outline btn-sm" onClick={addDocument}><i className="fas fa-plus"></i> Add Document</button></h2>
            {documents.map((doc, i) => (
              <div key={i} className="array-row">
                <input placeholder="Document Name" value={doc.name} onChange={(e) => updateDocument(i, 'name', e.target.value)} />
                <input placeholder="Document URL" value={doc.url} onChange={(e) => updateDocument(i, 'url', e.target.value)} />
                {documents.length > 1 && <button type="button" className="btn-icon-danger" onClick={() => removeDocument(i)}><i className="fas fa-times"></i></button>}
              </div>
            ))}
          </div>

          {isEdit && (
            <div className="form-section">
              <h2>Progress Update</h2>
              <div className="form-group">
                <label>Add Update Note</label>
                <textarea rows="3" value={updateNote} onChange={(e) => setUpdateNote(e.target.value)} placeholder="Enter progress update..." />
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/projects')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}