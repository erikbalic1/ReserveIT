import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Dummy foglalások
const DUMMY_USER_RESERVATIONS = [
  {
    id: 1,
    company: 'Szépségszalon Bella',
    service: 'Női hajvágás',
    date: '2025-11-20',
    time: '10:00',
    status: 'confirmed',
    notes: 'Kérem, hogy rövid hajat szeretnék'
  },
  {
    id: 2,
    company: 'Fitness Center Plus',
    service: 'Személyi edzés',
    date: '2025-11-22',
    time: '15:00',
    status: 'pending',
    notes: ''
  },
  {
    id: 3,
    company: 'Autó Szerviz Profi',
    service: 'Szerviz',
    date: '2025-11-18',
    time: '09:00',
    status: 'completed',
    notes: 'Olajcsere és szűrőcsere'
  }
];

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
      return;
    }

    // Dummy adatok betöltése
    setReservations(DUMMY_USER_RESERVATIONS);
  }, [user, navigate]);

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { class: 'badge-success', text: 'Megerősítve' },
      pending: { class: 'badge-warning', text: 'Függőben' },
      completed: { class: 'badge-success', text: 'Befejezve' },
      cancelled: { class: 'badge-danger', text: 'Törölve' }
    };
    return badges[status] || badges.pending;
  };

  const handleCancelReservation = (id) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a foglalást?')) {
      setReservations(reservations.map(res => 
        res.id === id ? { ...res, status: 'cancelled' } : res
      ));
      alert('Foglalás sikeresen törölve!');
    }
  };

  const filteredReservations = reservations.filter(res => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return res.status === 'confirmed' || res.status === 'pending';
    if (filter === 'past') return res.status === 'completed' || res.status === 'cancelled';
    return res.status === filter;
  });

  return (
    <div className="dashboard-page">
      <div className="container py-3">
        <div className="dashboard-header">
          <div>
            <h1>Felhasználói Dashboard</h1>
            <p>Üdvözlünk, <strong>{user?.name}</strong>! 👋</p>
          </div>
          <button className="btn btn-outline" onClick={() => navigate('/')}>
            Új foglalás
          </button>
        </div>

        {/* Statisztikák */}
        <div className="grid grid-3">
          <div className="card stat-card">
            <div className="stat-icon">📅</div>
            <h3>{reservations.filter(r => r.status === 'confirmed' || r.status === 'pending').length}</h3>
            <p>Aktív foglalás</p>
          </div>
          <div className="card stat-card">
            <div className="stat-icon">✅</div>
            <h3>{reservations.filter(r => r.status === 'completed').length}</h3>
            <p>Befejezett</p>
          </div>
          <div className="card stat-card">
            <div className="stat-icon">🔔</div>
            <h3>{reservations.filter(r => r.status === 'pending').length}</h3>
            <p>Függőben</p>
          </div>
        </div>

        {/* Szűrés */}
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Összes
          </button>
          <button 
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Közelgő
          </button>
          <button 
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Lezárt
          </button>
        </div>

        {/* Foglalások lista */}
        <div className="reservations-section">
          <h2>Foglalásaim</h2>
          
          {filteredReservations.length > 0 ? (
            <div className="reservations-list">
              {filteredReservations.map(reservation => {
                const badge = getStatusBadge(reservation.status);
                return (
                  <div key={reservation.id} className="card reservation-card">
                    <div className="reservation-header">
                      <h3>{reservation.company}</h3>
                      <span className={`badge ${badge.class}`}>{badge.text}</span>
                    </div>
                    
                    <div className="reservation-details">
                      <div className="detail-row">
                        <span className="detail-label">Szolgáltatás:</span>
                        <span>{reservation.service}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Dátum:</span>
                        <span>{reservation.date}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Időpont:</span>
                        <span>{reservation.time}</span>
                      </div>
                      {reservation.notes && (
                        <div className="detail-row">
                          <span className="detail-label">Megjegyzés:</span>
                          <span>{reservation.notes}</span>
                        </div>
                      )}
                    </div>

                    {(reservation.status === 'confirmed' || reservation.status === 'pending') && (
                      <div className="reservation-actions">
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => handleCancelReservation(reservation.id)}
                        >
                          Foglalás törlése
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-data">
              <p>Nincs megjeleníthető foglalás ebben a kategóriában.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
