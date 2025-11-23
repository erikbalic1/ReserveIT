import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { reservationAPI, userAPI } from '../../services/api';
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
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
      return;
    }

    // Fetch user's reservations from database
    const fetchReservations = async () => {
      try {
        const response = await reservationAPI.getByUser(user.id);
        if (response.success) {
          setReservations(response.data);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
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

  const handleCancelReservation = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        const response = await reservationAPI.update(id, { status: 'cancelled' });
        if (response.success) {
          setReservations(reservations.map(res => 
            res._id === id ? { ...res, status: 'cancelled' } : res
          ));
          alert('Reservation successfully cancelled!');
        }
      } catch (error) {
        console.error('Error canceling reservation:', error);
        alert('Failed to cancel reservation. Please try again.');
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and will delete all your reservations.')) {
      try {
        await userAPI.delete(user.id);
        alert('Account deleted successfully');
        logout();
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  const handleEditClick = () => {
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      confirmPassword: ''
    });
    setShowEditForm(true);
  };

  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (editFormData.password && editFormData.password !== editFormData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (editFormData.password && editFormData.password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    try {
      const updateData = {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone
      };

      // Only include password if user wants to change it
      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      const response = await userAPI.update(user.id, updateData);

      if (response.success) {
        alert('Profile updated successfully!');
        // Update user in context
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload(); // Reload to update context
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
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
            <p>Welcome, <strong>{user?.name}</strong>!</p>
          </div>
          <button className="btn btn-outline" onClick={() => navigate('/companies')}>
            New Booking
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-3">
          <div className="card stat-card">
            <div className="stat-icon"></div>
            <h3>{reservations.filter(r => r.status === 'confirmed' || r.status === 'pending').length}</h3>
            <p>Active Bookings</p>
          </div>
          <div className="card stat-card">
            <div className="stat-icon"></div>
            <h3>{reservations.filter(r => r.status === 'completed').length}</h3>
            <p>Completed</p>
          </div>
          <div className="card stat-card">
            <div className="stat-icon"></div>
            <h3>{reservations.filter(r => r.status === 'pending').length}</h3>
            <p>Pending</p>
          </div>
        </div>

        {/* Account Actions */}
        <div className="account-actions-section">
          <button 
            className="btn btn-primary"
            onClick={() => setShowProfile(!showProfile)}
          >
            {showProfile ? 'Hide Profile' : 'Show Profile'}
          </button>
          <button 
            className="btn btn-accent"
            onClick={handleEditClick}
          >
            Edit Account
          </button>
          <button 
            className="btn btn-outline btn-danger"
            onClick={handleDeleteAccount}
            style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }}
          >
            Delete Account
          </button>
        </div>

        {/* Profile View */}
        {showProfile && (
          <div className="card" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            <h2>My Profile</h2>
            <div className="profile-info">
              <div className="profile-row">
                <span className="profile-label">Name:</span>
                <span className="profile-value">{user.name}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Email:</span>
                <span className="profile-value">{user.email}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Phone:</span>
                <span className="profile-value">{user.phone}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Role:</span>
                <span className="profile-value">User</span>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Form */}
        {showEditForm && (
          <div className="card" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            <h2>Edit Profile</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={editFormData.phone}
                  onChange={handleEditInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  value={editFormData.password}
                  onChange={handleEditInputChange}
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  value={editFormData.confirmPassword}
                  onChange={handleEditInputChange}
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-accent">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setShowEditForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

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
                  <div key={reservation._id || reservation.id} className="card reservation-card">
                    <div className="reservation-header">
                      <h3>{reservation.companyName || reservation.company || 'Company'}</h3>
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
                          onClick={() => handleCancelReservation(reservation._id || reservation.id)}
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
