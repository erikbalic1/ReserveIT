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
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const categories = [
    'Szépségápolás',
    'Sport',
    'Wellness',
    'Autószerelés',
    'Állatorvos',
    'Étterem',
    'Egyéb'
  ];

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
      name: formData.companyName,
      ownerName: formData.ownerName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      description: formData.description,
      category: formData.category,
      role: 'company'
    }, 'dummy-token-new-company');

    alert('Sikeres vállalkozás regisztráció! Üdvözlünk a ReserveIt! rendszerben!');
    navigate('/dashboard/company');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card card">
          <h1 className="auth-title">Regisztráció - Vállalkozás</h1>
          <p className="auth-subtitle">Regisztráld vállalkozásod és kezdd el fogadni a foglalásokat!</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Vállalkozás neve *</label>
              <input
                type="text"
                name="companyName"
                className="form-input"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Szépségszalon Bella"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tulajdonos neve *</label>
              <input
                type="text"
                name="ownerName"
                className="form-input"
                value={formData.ownerName}
                onChange={handleChange}
                required
                placeholder="Nagy Éva"
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
                placeholder="info@vallalkozas.hu"
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
              <label className="form-label">Cím *</label>
              <input
                type="text"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="1052 Budapest, Petőfi Sándor utca 12."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kategória *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Válassz kategóriát</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Leírás *</label>
              <textarea
                name="description"
                className="form-textarea"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Rövid leírás a vállalkozásról és szolgáltatásokról..."
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
              Vállalkozás regisztrálása
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

export default RegisterCompany;
