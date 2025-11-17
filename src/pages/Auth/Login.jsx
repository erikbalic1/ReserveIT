import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Dummy login validation
    if (formData.email === 'user@test.hu' && formData.password === 'password') {
      // User login
      login({
        id: 1,
        name: 'Test User',
        email: formData.email,
        role: 'user'
      }, 'dummy-token-123');
      navigate('/dashboard/user');
    } else if (formData.email === 'company@test.hu' && formData.password === 'password') {
      // Company login
      login({
        id: 2,
        name: 'Test Company',
        email: formData.email,
        role: 'company'
      }, 'dummy-token-456');
      navigate('/dashboard/company');
    } else {
      setError('Invalid email or password!');
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

            <button type="submit" className="btn btn-accent auth-btn">
              Login
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

          <div className="demo-credentials">
            <p><strong>Demo login credentials:</strong></p>
            <p>User: user@test.hu / password</p>
            <p>Company: company@test.hu / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
