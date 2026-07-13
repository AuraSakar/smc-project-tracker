import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './AdminLogin.css';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (isAuthenticated) {
    navigate('/admin/dashboard');
    return null;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.employeeId, data.password);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page page-wrapper">
      <div className="login-card">
        <div className="logonew-section">
          <div className="logonew">
            <i className="fas fa-landmark"></i>
          </div>
          <h2>Admin Login</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Employee ID</label>
            <input {...register('employeeId', { required: 'Employee ID is required' })} placeholder="Enter your employee ID" />
            {errors.employeeId && <p className="form-error">{errors.employeeId.message}</p>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" {...register('password', { required: 'Password is required' })} placeholder="Enter your password" />
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}