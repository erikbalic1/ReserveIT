import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CompanyDetails.css';

// Dummy vállalkozások (ugyanaz mint CompanyList-ben)
const DUMMY_COMPANIES = [
  {
    id: 1,
    name: 'Szépségszalon Bella',
    description: 'Professzionális fodrászat és kozmetika Budapest szívében',
    address: '1052 Budapest, Petőfi Sándor utca 12.',
    phone: '+36 20 123 4567',
    email: 'info@bella.hu',
    category: 'Szépségápolás',
    image: 'https://via.placeholder.com/800x400?text=Szépségszalon',
    services: ['Női hajvágás', 'Férfi hajvágás', 'Festés', 'Manikűr', 'Pedikűr'],
    openingHours: 'H-P: 9:00-19:00, Szo: 9:00-15:00'
  },
  {
    id: 2,
    name: 'Fitness Center Plus',
    description: 'Modern edzőterem személyi edzőkkel',
    address: '1136 Budapest, Váci út 45.',
    phone: '+36 30 987 6543',
    email: 'info@fitnessplus.hu',
    category: 'Sport',
    image: 'https://via.placeholder.com/800x400?text=Fitness',
    services: ['Személyi edzés', 'Csoportos órák', 'Spinning', 'Jóga'],
    openingHours: 'H-P: 6:00-22:00, Szo-V: 8:00-20:00'
  },
  {
    id: 3,
    name: 'Autó Szerviz Profi',
    description: 'Teljes körű gépjármű szervizelés és karbantartás',
    address: '1113 Budapest, Karolina út 67.',
    phone: '+36 20 555 1234',
    email: 'info@autoprofi.hu',
    category: 'Autószerelés',
    image: 'https://via.placeholder.com/800x400?text=Autószerviz',
    services: ['Szerviz', 'Gumiabroncs csere', 'Műszaki vizsga', 'Diagnosztika'],
    openingHours: 'H-P: 8:00-17:00'
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
    // Dummy API hívás szimulálása
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
      alert('Jelentkezz be a foglaláshoz!');
      navigate('/login');
      return;
    }

    if (user.role === 'company') {
      alert('Vállalkozásként nem tudsz foglalni!');
      return;
    }

    // Dummy foglalás létrehozása
    console.log('Új foglalás:', {
      company: company.name,
      user: user.name,
      ...reservationForm
    });

    alert(`Foglalás sikeresen létrehozva!\n\nVállalkozás: ${company.name}\nDátum: ${reservationForm.date}\nIdőpont: ${reservationForm.time}\nSzolgáltatás: ${reservationForm.service}`);
    
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
          <h2>Betöltés...</h2>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container py-3">
        <div className="text-center">
          <h2>Vállalkozás nem található</h2>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/')}>
            Vissza a listához
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="company-details-page">
      <div className="company-hero">
        <img src={company.image} alt={company.name} />
        <div className="hero-overlay">
          <div className="container">
            <h1>{company.name}</h1>
            <span className="category-badge">{company.category}</span>
          </div>
        </div>
      </div>

      <div className="container py-3">
        <div className="company-content">
          {/* Bal oldal - Információk */}
          <div className="company-info-section">
            <div className="card">
              <h2>Leírás</h2>
              <p>{company.description}</p>
            </div>

            <div className="card">
              <h2>Szolgáltatások</h2>
              <ul className="services-list">
                {company.services.map((service, index) => (
                  <li key={index}>
                    <span className="service-icon">✓</span> {service}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h2>Elérhetőség</h2>
              <div className="contact-info">
                <p><strong>📍 Cím:</strong> {company.address}</p>
                <p><strong>📞 Telefon:</strong> {company.phone}</p>
                <p><strong>📧 Email:</strong> {company.email}</p>
                <p><strong>🕐 Nyitvatartás:</strong> {company.openingHours}</p>
              </div>
            </div>
          </div>

          {/* Jobb oldal - Foglalás */}
          <div className="reservation-section">
            <div className="card">
              <h2>Időpont foglalás</h2>
              
              {!showReservationForm ? (
                <button 
                  className="btn btn-accent" 
                  onClick={() => setShowReservationForm(true)}
                  style={{ width: '100%' }}
                >
                  Foglalás indítása
                </button>
              ) : (
                <form onSubmit={handleReservationSubmit}>
                  <div className="form-group">
                    <label className="form-label">Dátum *</label>
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
                    <label className="form-label">Időpont *</label>
                    <select
                      name="time"
                      className="form-select"
                      value={reservationForm.time}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Válassz időpontot</option>
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
                    <label className="form-label">Szolgáltatás *</label>
                    <select
                      name="service"
                      className="form-select"
                      value={reservationForm.service}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Válassz szolgáltatást</option>
                      {company.services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Megjegyzés</label>
                    <textarea
                      name="notes"
                      className="form-textarea"
                      rows="3"
                      value={reservationForm.notes}
                      onChange={handleInputChange}
                      placeholder="Egyéb kérések, megjegyzések..."
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-accent">
                      Foglalás megerősítése
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => setShowReservationForm(false)}
                    >
                      Mégse
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <button className="btn btn-outline mt-3" onClick={() => navigate('/')}>
          ← Vissza a vállalkozásokhoz
        </button>
      </div>
    </div>
  );
};

export default CompanyDetails;
