import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Dummy reservations
const DUMMY_USER_RESERVATIONS = [
  {
    id: 1,
    company: 'Beauty Salon Bella',
    service: 'Women\'s Haircut',
    date: '2025-11-20',
    time: '10:00',
    status: 'confirmed',
    notes: 'Please, I would like short hair'
  },
  {
    id: 2,
    company: 'Fitness Center Plus',
    service: 'Personal Training',
    date: '2025-11-22',
    time: '15:00',
    status: 'pending',
    notes: ''
  },
  {
    id: 3,
    company: 'Auto Service Pro',
    service: 'Service',
    date: '2025-11-18',
    time: '09:00',
    status: 'completed',
    notes: 'Oil change and filter replacement'
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
      confirmed: { class: 'badge-success', text: 'Confirmed' },
      pending: { class: 'badge-warning', text: 'Pending' },
      completed: { class: 'badge-success', text: 'Completed' },
      cancelled: { class: 'badge-danger', text: 'Cancelled' }
    };
    return badges[status] || badges.pending;
  };

  const handleCancelReservation = (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      setReservations(reservations.map(res => 
        res.id === id ? { ...res, status: 'cancelled' } : res
      ));
      alert('Reservation successfully cancelled!');
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
            <h1>User Dashboard</h1>
            <p>Welcome, <strong>{user?.name}</strong>! 👋</p>
          </div>
          <button className="btn btn-outline" onClick={() => navigate('/')}>
            New Booking
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-3">
          <div className="card stat-card">
            <div className="stat-icon">📅</div>
            <h3>{reservations.filter(r => r.status === 'confirmed' || r.status === 'pending').length}</h3>
            <p>Active Bookings</p>
          </div>
          <div className="card stat-card">
            <div className="stat-icon"></div>
            <h3>{reservations.filter(r => r.status === 'completed').length}</h3>
            <p>Completed</p>
          </div>
          <div className="card stat-card">
            <div className="stat-icon">🔔</div>
            <h3>{reservations.filter(r => r.status === 'pending').length}</h3>
            <p>Pending</p>
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
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
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
          <h2>My Bookings</h2>
          
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

                    {(reservation.status === 'confirmed' || reservation.status === 'pending') && (
                      <div className="reservation-actions">
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => handleCancelReservation(reservation.id)}
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}
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

export default UserDashboard;
