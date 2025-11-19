import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(
        { email: formData.email, password: formData.password },
        formData.role
      );

      if (result.success) {
        const userData = result.data;
        navigate(userData.role === 'company' ? '/dashboard/company' : '/dashboard/user');
      } else {
        setError(result.message || 'Invalid email or password!');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container fade-in">
        <div className="auth-card card">
          <h1 className="auth-title">Login</h1>
          <p className="auth-subtitle">Welcome back to ReserveIt! system</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@email.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Login As</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="company">Company</option>
              </select>
            </div>

            <button type="submit" className="btn btn-accent auth-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-links">
            <p>Don't have an account?</p>
            <Link to="/register/user" className="btn btn-outline">
              Sign Up as User
            </Link>
            <Link to="/register/company" className="btn btn-primary">
              Register as Company
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
