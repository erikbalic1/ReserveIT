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

    // Dummy bejelentkezés validáció
    if (formData.email === 'user@test.hu' && formData.password === 'password') {
      // User bejelentkezés
      login({
        id: 1,
        name: 'Teszt Felhasználó',
        email: formData.email,
        role: 'user'
      }, 'dummy-token-123');
      navigate('/dashboard/user');
    } else if (formData.email === 'company@test.hu' && formData.password === 'password') {
      // Company bejelentkezés
      login({
        id: 2,
        name: 'Teszt Vállalkozás',
        email: formData.email,
        role: 'company'
      }, 'dummy-token-456');
      navigate('/dashboard/company');
    } else {
      setError('Hibás email vagy jelszó!');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card card">
          <h1 className="auth-title">Bejelentkezés</h1>
          <p className="auth-subtitle">Üdvözlünk vissza a ReserveIt! rendszerben</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email cím</label>
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
              <label className="form-label">Jelszó</label>
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
              Bejelentkezés
            </button>
          </form>

          <div className="auth-divider">
            <span>vagy</span>
          </div>

          <div className="auth-links">
            <p>Még nincs fiókod?</p>
            <Link to="/register/user" className="btn btn-outline">
              Regisztráció felhasználóként
            </Link>
            <Link to="/register/company" className="btn btn-primary">
              Regisztráció vállalkozásként
            </Link>
          </div>

          <div className="demo-credentials">
            <p><strong>Demo bejelentkezési adatok:</strong></p>
            <p>Felhasználó: user@test.hu / password</p>
            <p>Vállalkozás: company@test.hu / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
