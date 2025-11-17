import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CompanyList.css';

// Dummy adatok
const DUMMY_COMPANIES = [
  {
    id: 1,
    name: 'Szépségszalon Bella',
    description: 'Professzionális fodrászat és kozmetika Budapest szívében',
    address: '1052 Budapest, Petőfi Sándor utca 12.',
    phone: '+36 20 123 4567',
    category: 'Szépségápolás',
    image: 'https://via.placeholder.com/300x200?text=Szépségszalon'
  },
  {
    id: 2,
    name: 'Fitness Center Plus',
    description: 'Modern edzőterem személyi edzőkkel',
    address: '1136 Budapest, Váci út 45.',
    phone: '+36 30 987 6543',
    category: 'Sport',
    image: 'https://via.placeholder.com/300x200?text=Fitness'
  },
  {
    id: 3,
    name: 'Autó Szerviz Profi',
    description: 'Teljes körű gépjármű szervizelés és karbantartás',
    address: '1113 Budapest, Karolina út 67.',
    phone: '+36 20 555 1234',
    category: 'Autószerelés',
    image: 'https://via.placeholder.com/300x200?text=Autószerviz'
  },
  {
    id: 4,
    name: 'Massage & Wellness',
    description: 'Relaxáló masszázs és wellness szolgáltatások',
    address: '1051 Budapest, Október 6. utca 22.',
    phone: '+36 70 888 9999',
    category: 'Wellness',
    image: 'https://via.placeholder.com/300x200?text=Wellness'
  },
  {
    id: 5,
    name: 'Állatorvosi Rendelő Dr. Kiss',
    description: 'Kisállat ellátás és sürgősségi szolgálat',
    address: '1027 Budapest, Margit körút 89.',
    phone: '+36 20 111 2222',
    category: 'Állatorvos',
    image: 'https://via.placeholder.com/300x200?text=Állatorvos'
  },
  {
    id: 6,
    name: 'Étterem La Cucina',
    description: 'Olasz specialitások és fine dining élmény',
    address: '1061 Budapest, Andrássy út 34.',
    phone: '+36 30 333 4444',
    category: 'Étterem',
    image: 'https://via.placeholder.com/300x200?text=Étterem'
  }
];

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy API hívás szimulálása
    setTimeout(() => {
      setCompanies(DUMMY_COMPANIES);
      setLoading(false);
    }, 500);
  }, []);

  // Szűrés kategória és keresés alapján
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || company.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Egyedi kategóriák kinyerése
  const categories = ['all', ...new Set(companies.map(c => c.category))];

  if (loading) {
    return (
      <div className="container py-3">
        <div className="text-center">
          <h2>Betöltés...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="company-list-page">
      <div className="container py-3">
        <div className="page-header">
          <h1>Vállalkozások</h1>
          <p className="text-light">Válassz a szolgáltatók közül és foglalj időpontot!</p>
        </div>

        {/* Keresés és szűrés */}
        <div className="filters-section">
          <input
            type="text"
            className="form-input search-input"
            placeholder="Keresés név vagy leírás alapján..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Összes' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Vállalkozások grid */}
        <div className="grid grid-3">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map(company => (
              <div key={company.id} className="card company-card">
                <div className="company-image">
                  <img src={company.image} alt={company.name} />
                  <span className="category-badge">{company.category}</span>
                </div>
                <div className="company-info">
                  <h3>{company.name}</h3>
                  <p className="company-description">{company.description}</p>
                  <div className="company-details">
                    <p><strong>📍</strong> {company.address}</p>
                    <p><strong>📞</strong> {company.phone}</p>
                  </div>
                  <Link to={`/company/${company.id}`} className="btn btn-accent mt-2">
                    Részletek és Foglalás
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <h3>Nem találhatók vállalkozások</h3>
              <p>Próbálj meg más keresési feltételekkel!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
