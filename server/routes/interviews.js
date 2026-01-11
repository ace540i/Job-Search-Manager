const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const { protect } = require('../middleware/auth');

router.use(protect);

// @route   GET /api/interviews
// @desc    Get all interviews for logged in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id })
      .populate('job', 'position company')
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          select: 'name logo'
        }
      })
      .sort({ scheduledDate: 1 });

    res.json({
      success: true,
      count: interviews.length,
      interviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/interviews
// @desc    Create a new interview
// @access  Private
router.post('/', async (req, res) => {
  try {
    req.body.user = req.user.id;
    const interview = await Interview.create(req.body);

    res.status(201).json({
      success: true,
      interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/interviews/:id
// @desc    Update an interview
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    interview = await Interview.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/interviews/:id
// @desc    Delete an interview
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await interview.deleteOne();

    res.json({
      success: true,
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
