import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CompanyList.css';

// Dummy data
const DUMMY_COMPANIES = [
  {
    id: 1,
    name: 'Beauty Salon Bella',
    description: 'Professional hairdressing and cosmetics in the heart of Budapest',
    address: '1052 Budapest, Petofi Street 12.',
    phone: '+36 20 123 4567',
    category: 'Beauty & Hair',
    image: 'https://via.placeholder.com/300x200?text=Beauty+Salon'
  },
  {
    id: 2,
    name: 'Fitness Center Plus',
    description: 'Modern gym with personal trainers',
    address: '1136 Budapest, Vaci Street 45.',
    phone: '+36 30 987 6543',
    category: 'Fitness & Sports',
    image: 'https://via.placeholder.com/300x200?text=Fitness'
  },
  {
    id: 3,
    name: 'Auto Service Pro',
    description: 'Complete vehicle servicing and maintenance',
    address: '1113 Budapest, Karolina Street 67.',
    phone: '+36 20 555 1234',
    category: 'Auto Services',
    image: 'https://via.placeholder.com/300x200?text=Auto+Service'
  },
  {
    id: 4,
    name: 'Massage & Wellness',
    description: 'Relaxing massage and wellness services',
    address: '1051 Budapest, October 6 Street 22.',
    phone: '+36 70 888 9999',
    category: 'Wellness & Spa',
    image: 'https://via.placeholder.com/300x200?text=Wellness'
  },
  {
    id: 5,
    name: 'Veterinary Clinic Dr. Kiss',
    description: 'Pet care and emergency services',
    address: '1027 Budapest, Margit Boulevard 89.',
    phone: '+36 20 111 2222',
    category: 'Veterinary',
    image: 'https://via.placeholder.com/300x200?text=Veterinary'
  },
  {
    id: 6,
    name: 'Restaurant La Cucina',
    description: 'Italian specialties and fine dining experience',
    address: '1061 Budapest, Andrassy Street 34.',
    phone: '+36 30 333 4444',
    category: 'Restaurant',
    image: 'https://via.placeholder.com/300x200?text=Restaurant'
  }
];

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating dummy API call
    setTimeout(() => {
      setCompanies(DUMMY_COMPANIES);
      setLoading(false);
    }, 500);
  }, []);

  // Filter by category and search
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || company.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories
  const categories = ['all', ...new Set(companies.map(c => c.category))];

  if (loading) {
    return (
      <div className="container py-3">
        <div className="text-center">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="company-list-page">
      <div className="container py-3">
        <div className="page-header">
          <h1>Companies</h1>
          <p className="text-light">Choose from our service providers and book an appointment!</p>
        </div>

        {/* Search and filter */}
        <div className="filters-section">
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by name or description..."
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
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Companies grid */}
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
                    Details & Book
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <h3>No companies found</h3>
              <p>Try different search criteria!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
