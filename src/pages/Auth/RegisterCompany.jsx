import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const RegisterCompany = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    companyName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    category: '',
    services: '',
    openingHours: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Beauty & Hair',
    'Fitness & Sports',
    'Wellness & Spa',
    'Auto Services',
    'Veterinary',
    'Restaurant',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long!');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, companyName, services, ...rest } = formData;
      const companyData = {
        name: companyName,
        services: services ? services.split(',').map(s => s.trim()).filter(s => s) : [],
        ...rest
      };
      
      const result = await register(companyData, 'company');

      if (result.success) {
        alert('Company registration successful! Welcome to ReserveIt! system!');
        navigate('/dashboard/company');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
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
          <h1 className="auth-title">Register - Company</h1>
          <p className="auth-subtitle">Register your business and start accepting reservations!</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                name="companyName"
                className="form-input"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Beauty Salon Bella"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Owner Name *</label>
              <input
                type="text"
                name="ownerName"
                className="form-input"
                value={formData.ownerName}
                onChange={handleChange}
                required
                placeholder="Jane Smith"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="info@company.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+36 20 123 4567"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address *</label>
              <input
                type="text"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="1052 Budapest, Petofi Street 12."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                className="form-textarea"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Brief description of your business and services..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Services</label>
              <input
                type="text"
                name="services"
                className="form-input"
                value={formData.services}
                onChange={handleChange}
                placeholder="Haircut, Manicure, Pedicure (comma separated)"
              />
              <small style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                Enter services separated by commas
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Opening Hours</label>
              <input
                type="text"
                name="openingHours"
                className="form-input"
                value={formData.openingHours}
                onChange={handleChange}
                placeholder="Mon-Fri: 9:00-17:00"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter password"
              />
            </div>

            <button type="submit" className="btn btn-accent auth-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register Company'}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-links">
            <p>Already have an account?</p>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCompany;
