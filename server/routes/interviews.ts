import express, { Router, Response } from 'express';
import Interview from '../models/Interview';
import { protect, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

router.use(protect);

// @route   GET /api/interviews
// @desc    Get all interviews for logged in user
// @access  Private
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const interviews = await Interview.find({ user: req.user!._id })
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
      message: (error as Error).message
    });
  }
});

// @route   POST /api/interviews
// @desc    Create a new interview
// @access  Private
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    req.body.user = req.user!._id;
    const interview = await Interview.create(req.body);

    res.status(201).json({
      success: true,
      interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

// @route   PUT /api/interviews/:id
// @desc    Update an interview
// @access  Private
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
      return;
    }

    if (interview.user.toString() !== req.user!._id.toString()) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
      return;
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
      message: (error as Error).message
    });
  }
});

// @route   DELETE /api/interviews/:id
// @desc    Delete an interview
// @access  Private
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
      return;
    }

    if (interview.user.toString() !== req.user!._id.toString()) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
      return;
    }

    await interview.deleteOne();

    res.json({
      success: true,
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

export = router;
