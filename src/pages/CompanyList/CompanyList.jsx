import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyAPI } from '../../services/api';
import './CompanyList.css';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companyAPI.getAll();
        if (response.success) {
          setCompanies(response.data);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
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
      <div className="container py-3 fade-in">
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
              <div key={company._id} className="card company-card">
                <div className="company-image">
                  <img src={company.image || 'https://via.placeholder.com/300x200?text=Company'} alt={company.name} />
                  <span className="category-badge">{company.category}</span>
                </div>
                <div className="company-info">
                  <h3>{company.name}</h3>
                  <p className="company-description">{company.description}</p>
                  <div className="company-details">
                    <p><strong>📍</strong> {company.address}</p>
                    <p><strong>Phone:</strong> {company.phone}</p>
                  </div>
                  <Link to={`/company/${company._id}`} className="btn btn-accent mt-2">
                    Details & Book
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <h3>No companies found</h3>
              <p>Try different search criteria or register a new company!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
