import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Dummy foglalások vállalkozásnak
const DUMMY_COMPANY_RESERVATIONS = [
  {
    id: 1,
    userName: 'Kiss Anna',
    userPhone: '+36 20 111 2222',
    service: 'Női hajvágás',
    date: '2025-11-20',
    time: '10:00',
    status: 'pending',
    notes: 'Kérem, hogy rövid hajat szeretnék'
  },
  {
    id: 2,
    userName: 'Nagy Péter',
    userPhone: '+36 30 333 4444',
    service: 'Férfi hajvágás',
    date: '2025-11-21',
    time: '14:00',
    status: 'confirmed',
    notes: ''
  },
  {
    id: 3,
    userName: 'Szabó Éva',
    userPhone: '+36 70 555 6666',
    service: 'Festés',
    date: '2025-11-19',
    time: '11:00',
    status: 'completed',
    notes: 'Világos szőke árnyalat'
  },
  {
    id: 4,
    userName: 'Kovács János',
    userPhone: '+36 20 777 8888',
    service: 'Manikűr',
    date: '2025-11-22',
    time: '16:00',
    status: 'confirmed',
    notes: ''
  }
];

const CompanyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'company') {
      navigate('/login');
      return;
    }

    // Dummy adatok betöltése
    setReservations(DUMMY_COMPANY_RESERVATIONS);
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

  const handleConfirmReservation = (id) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status: 'confirmed' } : res
    ));
    alert('Foglalás megerősítve!');
  };

  const handleCompleteReservation = (id) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status: 'completed' } : res
    ));
    alert('Foglalás befejezettként jelölve!');
  };

  const handleCancelReservation = (id) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a foglalást?')) {
      setReservations(reservations.map(res => 
        res.id === id ? { ...res, status: 'cancelled' } : res
      ));
      alert('Foglalás törölve!');
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
            <h1>Vállalkozói Dashboard</h1>
            <p>Üdvözlünk, <strong>{user?.name}</strong>! 🏢</p>
          </div>
        </div>

        {/* Statisztikák */}
        <div className="grid grid-3">
          <div className="card stat-card">
            <div className="stat-icon">⏳</div>
            <h3>{reservations.filter(r => r.status === 'pending').length}</h3>
            <p>Függőben lévő</p>
          </div>
          <div className="card stat-card">
            <div className="stat-icon">✅</div>
            <h3>{reservations.filter(r => r.status === 'confirmed').length}</h3>
            <p>Megerősített</p>
          </div>
          <div className="card stat-card">
            <div className="stat-icon">🎉</div>
            <h3>{reservations.filter(r => r.status === 'completed').length}</h3>
            <p>Befejezett</p>
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
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Függőben
          </button>
          <button 
            className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Megerősített
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
          <h2>Foglalások kezelése</h2>
          
          {filteredReservations.length > 0 ? (
            <div className="reservations-list">
              {filteredReservations.map(reservation => {
                const badge = getStatusBadge(reservation.status);
                return (
                  <div key={reservation.id} className="card reservation-card">
                    <div className="reservation-header">
                      <h3>{reservation.userName}</h3>
                      <span className={`badge ${badge.class}`}>{badge.text}</span>
                    </div>
                    
                    <div className="reservation-details">
                      <div className="detail-row">
                        <span className="detail-label">Telefon:</span>
                        <span>{reservation.userPhone}</span>
                      </div>
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

                    <div className="reservation-actions">
                      {reservation.status === 'pending' && (
                        <button 
                          className="btn btn-accent btn-sm"
                          onClick={() => handleConfirmReservation(reservation.id)}
                        >
                          Megerősítés
                        </button>
                      )}
                      {reservation.status === 'confirmed' && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleCompleteReservation(reservation.id)}
                        >
                          Befejezettként jelöl
                        </button>
                      )}
                      {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => handleCancelReservation(reservation.id)}
                        >
                          Törlés
                        </button>
                      )}
                    </div>
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

export default CompanyDashboard;
