const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// @route   POST /api/companies/register
// @desc    Register a new company
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, category, description, address, services, openingHours, image } = req.body;

    // Check if company already exists
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.status(400).json({
        success: false,
        message: 'Company already exists with this email'
      });
    }

    // Create company (password will be hashed by pre-save hook)
    const company = await Company.create({
      name,
      email,
      password,
      phone,
      category,
      description,
      address,
      services,
      openingHours,
      image
    });

    if (company) {
      res.status(201).json({
        success: true,
        message: 'Company registered successfully',
        data: {
          id: company._id,
          name: company.name,
          email: company.email,
          phone: company.phone,
          category: company.category,
          role: company.role,
          token: generateToken(company._id)
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error registering company',
      error: error.message
    });
  }
});

// @route   POST /api/companies/login
// @desc    Login company
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find company
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await company.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: company._id,
        name: company.name,
        email: company.email,
        phone: company.phone,
        category: company.category,
        role: company.role,
        token: generateToken(company._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
});

// @route   GET /api/companies
// @desc    Get all companies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching companies',
      error: error.message
    });
  }
});

// @route   GET /api/companies/:id
// @desc    Get company by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).select('-password');
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching company',
      error: error.message
    });
  }
});

module.exports = router;
