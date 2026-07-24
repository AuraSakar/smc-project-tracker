import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { formatINR, formatDate } from '../../utils/format';
import './DepartmentDashboard.css';

export default function DepartmentDashboard() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [project, setProject] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billsLoading, setBillsLoading] = useState(false);

  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    billNo: '',
    raBill: '1st RA Bill',
    billDetails: '',
    amount: '',
  });

  // Fetch all projects for dropdown selector
  useEffect(() => {
    api.get('/projects?limit=100')
      .then((res) => {
        const fetchedProjects = res.data.projects || [];
        setProjects(fetchedProjects);
        if (fetchedProjects.length > 0) {
          setSelectedProjectId(fetchedProjects[0]._id || fetchedProjects[0].id);
        }
      })
      .catch((err) => toast.error(t('Failed to load projects')))
      .finally(() => setLoading(false));
  }, [t]);

  // Fetch selected project details & bills
  useEffect(() => {
    if (!selectedProjectId) return;
    setBillsLoading(true);
    api.get(`/projects/${selectedProjectId}`)
      .then((res) => {
        setProject(res.data.project);
        setBills(res.data.project.bills || []);
      })
      .catch((err) => toast.error(t('Failed to load project details')))
      .finally(() => setBillsLoading(false));
  }, [selectedProjectId, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    if (!formData.billNo || !formData.raBill || !formData.billDetails || !formData.amount) {
      toast.error(t('Please fill in all bill fields'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/projects/${selectedProjectId}/bills`, formData);
      toast.success(t('Bill added successfully'));
      
      // Update local state
      const newBill = res.data.bill;
      setBills((prev) => [...prev, newBill]);
      
      // Refresh project to update total amountSpent
      const projRes = await api.get(`/projects/${selectedProjectId}`);
      setProject(projRes.data.project);

      // Reset Form & Close Modal
      setFormData({
        billNo: '',
        raBill: '1st RA Bill',
        billDetails: '',
        amount: '',
      });
      setShowAddModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || t('Failed to add bill'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBill = async (billId, billNo) => {
    if (!window.confirm(t('Are you sure you want to remove bill {{billNo}}?', { billNo }))) {
      return;
    }

    try {
      await api.delete(`/projects/${selectedProjectId}/bills/${billId}`);
      toast.success(t('Bill removed successfully'));
      
      setBills((prev) => prev.filter((b) => b.id !== billId));

      // Refresh project to sync amountSpent
      const projRes = await api.get(`/projects/${selectedProjectId}`);
      setProject(projRes.data.project);
    } catch (err) {
      toast.error(err.response?.data?.message || t('Failed to delete bill'));
    }
  };

  const totalBilled = bills.reduce((sum, b) => sum + Number(b.amount || 0), 0);

  if (loading) return <div className="page-wrapper text-center">{t('Loading projects...')}</div>;

  return (
    <div className="dept-dashboard">
      <div className="dept-dashboard-header">
        <div>
          <h2>{t('Department Billing Management')}</h2>
          <p className="subtitle">{t('Issue, track, and manage official municipal corporation bills')}</p>
        </div>
      </div>

      {/* Project Selector Bar */}
      <div className="project-selector-card">
        <label htmlFor="project-select">
          <i className="fas fa-project-diagram"></i> {t('Select Project:')}
        </label>
        <select 
          id="project-select"
          value={selectedProjectId} 
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="project-select-dropdown"
        >
          {projects.map((p) => (
            <option key={p._id || p.id} value={p._id || p.id}>
              {p.projectId} — {p.title} ({p.ward})
            </option>
          ))}
        </select>
      </div>

      {project && (
        <>
          {/* Project Summary Cards */}
          <div className="dept-stats-grid">
            <div className="dept-stat-card">
              <div className="stat-icon primary"><i className="fas fa-calculator"></i></div>
              <div className="stat-content">
                <span className="stat-label">{t('Estimated Cost')}</span>
                <span className="stat-value">{formatINR(project.estimatedCost)}</span>
              </div>
            </div>

            <div className="dept-stat-card">
              <div className="stat-icon accent"><i className="fas fa-file-invoice-dollar"></i></div>
              <div className="stat-content">
                <span className="stat-label">{t('Total Billed Amount')}</span>
                <span className="stat-value">{formatINR(totalBilled)}</span>
              </div>
            </div>

            <div className="dept-stat-card">
              <div className="stat-icon green"><i className="fas fa-wallet"></i></div>
              <div className="stat-content">
                <span className="stat-label">{t('Remaining Budget')}</span>
                <span className={`stat-value ${project.estimatedCost - totalBilled < 0 ? 'negative' : ''}`}>
                  {formatINR(project.estimatedCost - totalBilled)}
                </span>
              </div>
            </div>

            <div className="dept-stat-card">
              <div className="stat-icon info"><i className="fas fa-receipt"></i></div>
              <div className="stat-content">
                <span className="stat-label">{t('Total Bills Issued')}</span>
                <span className="stat-value">{bills.length}</span>
              </div>
            </div>
          </div>

          {/* Bills Table Container */}
          <div className="bills-section-card">
            <div className="bills-section-header">
              <div>
                <h3><i className="fas fa-list-alt"></i> {t('Project Bills Record')}</h3>
                <span className="project-title-sub">{project.title} ({project.projectId})</span>
              </div>
              <button 
                className="btn btn-accent add-bill-btn"
                onClick={() => setShowAddModal(true)}
              >
                <i className="fas fa-plus"></i> {t('Add New Bill')}
              </button>
            </div>

            {billsLoading ? (
              <div className="text-center p-3">{t('Loading bills...')}</div>
            ) : bills.length === 0 ? (
              <div className="empty-bills-notice">
                <i className="fas fa-file-invoice"></i>
                <p>{t('No bills have been added for this project yet.')}</p>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
                  {t('Issue First Bill')}
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="bills-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>{t('Sr. No.')}</th>
                      <th style={{ width: '160px' }}>{t('Bill No.')}</th>
                      <th style={{ width: '140px' }}>{t('RA Bill')}</th>
                      <th>{t('Bill Details')}</th>
                      <th style={{ width: '160px', textAlign: 'right' }}>{t('Amount')}</th>
                      <th style={{ width: '100px', textAlign: 'center' }}>{t('Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((bill, index) => (
                      <tr key={bill.id}>
                        <td className="sr-no-cell">{index + 1}</td>
                        <td className="bill-no-cell font-mono">{bill.billNo}</td>
                        <td>
                          <span className="ra-bill-tag">{bill.raBill}</span>
                        </td>
                        <td className="bill-details-cell">{bill.billDetails}</td>
                        <td className="amount-cell">{formatINR(bill.amount)}</td>
                        <td className="action-cell">
                          <button 
                            className="btn-icon delete-btn"
                            title={t('Remove Bill')}
                            onClick={() => handleDeleteBill(bill.id, bill.billNo)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="text-right font-bold">{t('Total Billed Amount')}:</td>
                      <td className="amount-cell font-bold text-accent">{formatINR(totalBilled)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Bill Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-file-invoice"></i> {t('Issue New Bill')}</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleAddBill}>
              <div className="modal-body">
                <div className="form-group">
                  <label>{t('Bill No.')} *</label>
                  <input 
                    type="text" 
                    name="billNo" 
                    value={formData.billNo} 
                    onChange={handleInputChange} 
                    placeholder={t('e.g. SMC/PW/2026/001')} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>{t('RA Bill (Stage)')} *</label>
                  <select name="raBill" value={formData.raBill} onChange={handleInputChange} required>
                    <option value="1st RA Bill">1st RA Bill</option>
                    <option value="2nd RA Bill">2nd RA Bill</option>
                    <option value="3rd RA Bill">3rd RA Bill</option>
                    <option value="4th RA Bill">4th RA Bill</option>
                    <option value="5th RA Bill">5th RA Bill</option>
                    <option value="Final RA Bill">Final RA Bill</option>
                    <option value="Advance Bill">Advance Bill</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{t('Bill Details')} *</label>
                  <textarea 
                    name="billDetails" 
                    value={formData.billDetails} 
                    onChange={handleInputChange} 
                    placeholder={t('Describe the work stage, items, or particulars for this bill...')} 
                    rows="3"
                    required 
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>{t('Amount (₹)')} *</label>
                  <input 
                    type="number" 
                    name="amount" 
                    value={formData.amount} 
                    onChange={handleInputChange} 
                    placeholder={t('e.g. 450000')} 
                    min="0"
                    step="0.01"
                    required 
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  {t('Cancel')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? t('Saving...') : t('Add Bill')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
