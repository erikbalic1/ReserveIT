import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const RegisterUser = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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

    // Validáció
    if (formData.password !== formData.confirmPassword) {
      setError('A jelszavak nem egyeznek!');
      return;
    }

    if (formData.password.length < 6) {
      setError('A jelszónak legalább 6 karakter hosszúnak kell lennie!');
      return;
    }

    // Dummy regisztráció
    register({
      id: Math.random(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: 'user'
    }, 'dummy-token-new-user');

    alert('Sikeres regisztráció! Üdvözlünk a ReserveIt! rendszerben!');
    navigate('/dashboard/user');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card card">
          <h1 className="auth-title">Regisztráció - Felhasználó</h1>
          <p className="auth-subtitle">Csatlakozz hozzánk és foglalj időpontokat könnyedén!</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Teljes név *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Kovács János"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email cím *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="pelda@email.hu"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Telefonszám *</label>
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
              <label className="form-label">Jelszó *</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Minimum 6 karakter"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Jelszó megerősítése *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Jelszó újra"
              />
            </div>

            <button type="submit" className="btn btn-accent auth-btn">
              Regisztráció
            </button>
          </form>

          <div className="auth-divider">
            <span>vagy</span>
          </div>

          <div className="auth-links">
            <p>Már van fiókod?</p>
            <Link to="/login" className="btn btn-outline">
              Bejelentkezés
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
