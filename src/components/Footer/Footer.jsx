import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <p className="copyright">
            &copy; {new Date().getFullYear()} ReserveIt! All rights reserved.
          </p>
        </div>
        
        <div className="footer-section">
          <p className="creator">
            Created by{' '}
            <a 
              href="https://github.com/erikbalic1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
            >
              erikbalic1
            </a>
          </p>
        </div>
        
        <div className="footer-section">
          <a 
            href="https://github.com/erikbalic1/ReserveIT" 
            target="_blank" 
            rel="noopener noreferrer"
            className="source-link"
          >
            View Source Code
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
