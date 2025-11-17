import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CompanyDetails.css';

// Dummy companies (same as in CompanyList)
const DUMMY_COMPANIES = [
  {
    id: 1,
    name: 'Beauty Salon Bella',
    description: 'Professional hairdressing and cosmetics in the heart of Budapest',
    address: '1052 Budapest, Petofi Street 12.',
    phone: '+36 20 123 4567',
    email: 'info@bella.hu',
    category: 'Beauty & Hair',
    image: 'https://via.placeholder.com/800x400?text=Beauty+Salon',
    services: ['Women\'s Haircut', 'Men\'s Haircut', 'Hair Coloring', 'Manicure', 'Pedicure'],
    openingHours: 'Mon-Fri: 9:00-19:00, Sat: 9:00-15:00'
  },
  {
    id: 2,
    name: 'Fitness Center Plus',
    description: 'Modern gym with personal trainers',
    address: '1136 Budapest, Vaci Street 45.',
    phone: '+36 30 987 6543',
    email: 'info@fitnessplus.hu',
    category: 'Fitness & Sports',
    image: 'https://via.placeholder.com/800x400?text=Fitness',
    services: ['Personal Training', 'Group Classes', 'Spinning', 'Yoga'],
    openingHours: 'Mon-Fri: 6:00-22:00, Sat-Sun: 8:00-20:00'
  },
  {
    id: 3,
    name: 'Auto Service Pro',
    description: 'Complete vehicle servicing and maintenance',
    address: '1113 Budapest, Karolina Street 67.',
    phone: '+36 20 555 1234',
    email: 'info@autopro.hu',
    category: 'Auto Services',
    image: 'https://via.placeholder.com/800x400?text=Auto+Service',
    services: ['Service', 'Tire Replacement', 'Technical Inspection', 'Diagnostics'],
    openingHours: 'Mon-Fri: 8:00-17:00'
  }
];

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservationForm, setReservationForm] = useState({
    date: '',
    time: '',
    service: '',
    notes: ''
  });
  const [showReservationForm, setShowReservationForm] = useState(false);

  useEffect(() => {
    // Simulating dummy API call
    setTimeout(() => {
      const foundCompany = DUMMY_COMPANIES.find(c => c.id === parseInt(id));
      setCompany(foundCompany);
      setLoading(false);
    }, 300);
  }, [id]);

  const handleInputChange = (e) => {
    setReservationForm({
      ...reservationForm,
      [e.target.name]: e.target.value
    });
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to make a reservation!');
      navigate('/login');
      return;
    }

    if (user.role === 'company') {
      alert('Companies cannot make reservations!');
      return;
    }

    // Creating dummy reservation
    console.log('New reservation:', {
      company: company.name,
      user: user.name,
      ...reservationForm
    });

    alert(`Reservation successfully created!\n\nCompany: ${company.name}\nDate: ${reservationForm.date}\nTime: ${reservationForm.time}\nService: ${reservationForm.service}`);
    
    // Form reset
    setReservationForm({
      date: '',
      time: '',
      service: '',
      notes: ''
    });
    setShowReservationForm(false);
  };

  if (loading) {
    return (
      <div className="container py-3">
        <div className="text-center">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container py-3">
        <div className="text-center">
          <h2>Company not found</h2>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/')}>
            Back to list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="company-details-page fade-in">
      <div className="company-hero">\n        <img src={company.image} alt={company.name} />
        <div className="hero-overlay">
          <div className="container">
            <h1>{company.name}</h1>
            <span className="category-badge">{company.category}</span>
          </div>
        </div>
      </div>

      <div className="container py-3">
        <div className="company-content">
          {/* Left side - Information */}
          <div className="company-info-section">
            <div className="card">
              <h2>Description</h2>
              <p>{company.description}</p>
            </div>

            <div className="card">
              <h2>Services</h2>
              <ul className="services-list">
                {company.services.map((service, index) => (
                  <li key={index}>
                    <span className="service-icon">✓</span> {service}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h2>Contact</h2>
              <div className="contact-info">
                <p><strong>📍 Address:</strong> {company.address}</p>
                <p><strong>Phone:</strong> {company.phone}</p>
                <p><strong>Email:</strong> {company.email}</p>
                <p><strong>🕐 Opening Hours:</strong> {company.openingHours}</p>
              </div>
            </div>
          </div>

          {/* Right side - Reservation */}
          <div className="reservation-section">
            <div className="card">
              <h2>Book Appointment</h2>
              
              {!showReservationForm ? (
                <button 
                  className="btn btn-accent" 
                  onClick={() => setShowReservationForm(true)}
                  style={{ width: '100%' }}
                >
                  Start Booking
                </button>
              ) : (
                <form onSubmit={handleReservationSubmit}>
                  <div className="form-group">
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      name="date"
                      className="form-input"
                      value={reservationForm.date}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Time *</label>
                    <select
                      name="time"
                      className="form-select"
                      value={reservationForm.time}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select time</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Service *</label>
                    <select
                      name="service"
                      className="form-select"
                      value={reservationForm.service}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select service</option>
                      {company.services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea
                      name="notes"
                      className="form-textarea"
                      rows="3"
                      value={reservationForm.notes}
                      onChange={handleInputChange}
                      placeholder="Any special requests or notes..."
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-accent">
                      Confirm Booking
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => setShowReservationForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <button className="btn btn-outline mt-3" onClick={() => navigate('/')}>
          ← Back to companies
        </button>
      </div>
    </div>
  );
};

export default CompanyDetails;
