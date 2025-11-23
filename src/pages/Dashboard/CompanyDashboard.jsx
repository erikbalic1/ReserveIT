import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { reservationAPI, companyAPI } from '../../services/api';
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
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    description: '',
    address: '',
    services: '',
    openingHours: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'company') {
      navigate('/login');
      return;
    }

    // Fetch company's reservations from database
    const fetchReservations = async () => {
      try {
        const response = await reservationAPI.getByCompany(user.id);
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

  const handleConfirmReservation = async (id) => {
    try {
      const response = await reservationAPI.update(id, { status: 'confirmed' });
      if (response.success) {
        setReservations(reservations.map(res => 
          res._id === id ? { ...res, status: 'confirmed' } : res
        ));
        alert('Reservation confirmed!');
      }
    } catch (error) {
      console.error('Error confirming reservation:', error);
      alert('Failed to confirm reservation.');
    }
  };

  const handleCompleteReservation = async (id) => {
    try {
      const response = await reservationAPI.update(id, { status: 'completed' });
      if (response.success) {
        setReservations(reservations.map(res => 
          res._id === id ? { ...res, status: 'completed' } : res
        ));
        alert('Reservation marked as completed!');
      }
    } catch (error) {
      console.error('Error completing reservation:', error);
      alert('Failed to complete reservation.');
    }
  };

  const handleCancelReservation = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        const response = await reservationAPI.update(id, { status: 'cancelled' });
        if (response.success) {
          setReservations(reservations.map(res => 
            res._id === id ? { ...res, status: 'cancelled' } : res
          ));
          alert('Reservation cancelled!');
        }
      } catch (error) {
        console.error('Error canceling reservation:', error);
        alert('Failed to cancel reservation.');
      }
    }
  };

  const handleEditClick = () => {
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      category: user.category || '',
      description: user.description || '',
      address: user.address || '',
      services: user.services ? user.services.join(', ') : '',
      openingHours: user.openingHours || '',
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
        phone: editFormData.phone,
        category: editFormData.category,
        description: editFormData.description,
        address: editFormData.address,
        services: editFormData.services ? editFormData.services.split(',').map(s => s.trim()).filter(s => s) : [],
        openingHours: editFormData.openingHours
      };

      // Only include password if user wants to change it
      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      const response = await companyAPI.update(user.id, updateData);

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

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your company account? This action cannot be undone and will delete all your reservations.')) {
      try {
        await companyAPI.delete(user.id);
        alert('Company account deleted successfully');
        logout();
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      }
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
            <h2>Company Profile</h2>
            <div className="profile-info">
              <div className="profile-row">
                <span className="profile-label">Company Name:</span>
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
                <span className="profile-label">Category:</span>
                <span className="profile-value">{user.category}</span>
              </div>
              {user.description && (
                <div className="profile-row">
                  <span className="profile-label">Description:</span>
                  <span className="profile-value">{user.description}</span>
                </div>
              )}
              {user.address && (
                <div className="profile-row">
                  <span className="profile-label">Address:</span>
                  <span className="profile-value">{user.address}</span>
                </div>
              )}
              {user.services && user.services.length > 0 && (
                <div className="profile-row">
                  <span className="profile-label">Services:</span>
                  <span className="profile-value">{user.services.join(', ')}</span>
                </div>
              )}
              {user.openingHours && (
                <div className="profile-row">
                  <span className="profile-label">Opening Hours:</span>
                  <span className="profile-value">{user.openingHours}</span>
                </div>
              )}
              <div className="profile-row">
                <span className="profile-label">Role:</span>
                <span className="profile-value">Company</span>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Form */}
        {showEditForm && (
          <div className="card" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            <h2>Edit Company Profile</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
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
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  className="form-select"
                  value={editFormData.category}
                  onChange={handleEditInputChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Beauty & Hair">Beauty & Hair</option>
                  <option value="Fitness & Sports">Fitness & Sports</option>
                  <option value="Wellness & Spa">Wellness & Spa</option>
                  <option value="Auto Services">Auto Services</option>
                  <option value="Veterinary">Veterinary</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  rows="3"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  value={editFormData.address}
                  onChange={handleEditInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Services</label>
                <input
                  type="text"
                  name="services"
                  className="form-input"
                  value={editFormData.services}
                  onChange={handleEditInputChange}
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
                  value={editFormData.openingHours}
                  onChange={handleEditInputChange}
                  placeholder="Mon-Fri: 9:00-17:00"
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
                  <div key={reservation._id || reservation.id} className="card reservation-card">
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
                          onClick={() => handleConfirmReservation(reservation._id || reservation.id)}
                        >
                          Confirm
                        </button>
                      )}
                      {reservation.status === 'confirmed' && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleCompleteReservation(reservation._id || reservation.id)}
                        >
                          Mark as Completed
                        </button>
                      )}
                      {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => handleCancelReservation(reservation._id || reservation.id)}
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
