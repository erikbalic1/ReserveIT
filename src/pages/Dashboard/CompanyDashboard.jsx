import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Dummy reservations for company
const DUMMY_COMPANY_RESERVATIONS = [
  {
    id: 1,
    userName: 'Anna Kiss',
    userPhone: '+36 20 111 2222',
    service: 'Women\'s Haircut',
    date: '2025-11-20',
    time: '10:00',
    status: 'pending',
    notes: 'Please, I would like short hair'
  },
  {
    id: 2,
    userName: 'Peter Nagy',
    userPhone: '+36 30 333 4444',
    service: 'Men\'s Haircut',
    date: '2025-11-21',
    time: '14:00',
    status: 'confirmed',
    notes: ''
  },
  {
    id: 3,
    userName: 'Eva Szabo',
    userPhone: '+36 70 555 6666',
    service: 'Hair Coloring',
    date: '2025-11-19',
    time: '11:00',
    status: 'completed',
    notes: 'Light blonde shade'
  },
  {
    id: 4,
    userName: 'John Kovacs',
    userPhone: '+36 20 777 8888',
    service: 'Manicure',
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
      confirmed: { class: 'badge-success', text: 'Confirmed' },
      pending: { class: 'badge-warning', text: 'Pending' },
      completed: { class: 'badge-success', text: 'Completed' },
      cancelled: { class: 'badge-danger', text: 'Cancelled' }
    };
    return badges[status] || badges.pending;
  };

  const handleConfirmReservation = (id) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status: 'confirmed' } : res
    ));
    alert('Reservation confirmed!');
  };

  const handleCompleteReservation = (id) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status: 'completed' } : res
    ));
    alert('Reservation marked as completed!');
  };

  const handleCancelReservation = (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      setReservations(reservations.map(res => 
        res.id === id ? { ...res, status: 'cancelled' } : res
      ));
      alert('Reservation cancelled!');
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
      <div className="container py-3 fade-in">
        <div className="dashboard-header">
          <div>
            <h1>Company Dashboard</h1>
            <p>Welcome, <strong>{user?.name}</strong>!</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-3">
          <div className="card stat-card">
            <div className="stat-icon"></div>
            <h3>{reservations.filter(r => r.status === 'pending').length}</h3>
            <p>Pending</p>
          </div>
          <div className="card stat-card">
            <div className="stat-icon"></div>
            <h3>{reservations.filter(r => r.status === 'confirmed').length}</h3>
            <p>Confirmed</p>
          </div>
          <div className="card stat-card">
            <div className="stat-icon"></div>
            <h3>{reservations.filter(r => r.status === 'completed').length}</h3>
            <p>Completed</p>
          </div>
        </div>

        {/* Filter */}
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </button>
          <button 
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past
          </button>
        </div>

        {/* Reservations list */}
        <div className="reservations-section">
          <h2>Manage Reservations</h2>
          
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
                        <span className="detail-label">Phone:</span>
                        <span>{reservation.userPhone}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Service:</span>
                        <span>{reservation.service}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Date:</span>
                        <span>{reservation.date}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Time:</span>
                        <span>{reservation.time}</span>
                      </div>
                      {reservation.notes && (
                        <div className="detail-row">
                          <span className="detail-label">Notes:</span>
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
                          Confirm
                        </button>
                      )}
                      {reservation.status === 'confirmed' && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleCompleteReservation(reservation.id)}
                        >
                          Mark as Completed
                        </button>
                      )}
                      {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => handleCancelReservation(reservation.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-data">
              <p>No reservations to display in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
