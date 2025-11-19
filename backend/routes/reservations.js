const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// @route   GET /api/reservations
// @desc    Get all reservations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reservations',
      error: error.message
    });
  }
});

// @route   GET /api/reservations/:id
// @desc    Get single reservation by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reservation',
      error: error.message
    });
  }
});

// @route   GET /api/reservations/user/:userId
// @desc    Get reservations by user ID
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user reservations',
      error: error.message
    });
  }
});

// @route   GET /api/reservations/company/:companyId
// @desc    Get reservations by company ID
// @access  Public
router.get('/company/:companyId', async (req, res) => {
  try {
    const reservations = await Reservation.find({ companyId: req.params.companyId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching company reservations',
      error: error.message
    });
  }
});

// @route   POST /api/reservations
// @desc    Create a new reservation
// @access  Public
router.post('/', async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating reservation',
      error: error.message
    });
  }
});

// @route   PUT /api/reservations/:id
// @desc    Update a reservation
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Reservation updated successfully',
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating reservation',
      error: error.message
    });
  }
});

// @route   DELETE /api/reservations/:id
// @desc    Delete a reservation
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Reservation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting reservation',
      error: error.message
    });
  }
});

module.exports = router;
