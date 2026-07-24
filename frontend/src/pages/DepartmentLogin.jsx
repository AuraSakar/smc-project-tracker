import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './DepartmentLogin.css';

export default function DepartmentLogin() {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (isAuthenticated) {
    navigate('/department/dashboard');
    return null;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.employeeId, data.password);
      toast.success(t('Department Login Successful'));
      navigate('/department/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || t('Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page page-wrapper">
      <div className="login-card department-login-card">
        <div className="logonew-section">
          <div className="logonew">
            <i className="fas fa-building"></i>
          </div>
          <h2>{t('Department Login')}</h2>
          <p className="login-subtitle">{t('Sign in to manage project billing & RA bills')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label><i className="fas fa-id-badge"></i> {t('Department Employee ID')}</label>
            <input 
              {...register('employeeId', { required: t('Employee ID is required') })} 
              placeholder={t('e.g. DEP001')} 
              autoFocus
            />
            {errors.employeeId && <p className="form-error">{errors.employeeId.message}</p>}
          </div>

          <div className="form-group">
            <label><i className="fas fa-key"></i> {t('Password')}</label>
            <input 
              type="password" 
              {...register('password', { required: t('Password is required') })} 
              placeholder={t('Enter department password')} 
            />
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? t('Signing in...') : t('Department Sign In')}
          </button>
        </form>

        <div className="login-card-footer">
          <Link to="/login" className="back-link">
            <i className="fas fa-arrow-left"></i> {t('Back to Login Selector')}
          </Link>
        </div>
      </div>
    </div>
  );
}
