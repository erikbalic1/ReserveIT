import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page fade-in">
      <div className="home-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="brand-name">Reserve<span className="brand-accent">It!</span></span>
            </h1>
            <p className="hero-subtitle">
              Discover and book services from trusted companies with ease. 
              Your perfect reservation is just a click away.
            </p>
            <Link to="/companies" className="btn btn-accent btn-large">
              Browse Companies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
