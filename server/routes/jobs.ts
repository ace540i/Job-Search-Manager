import express, { Router, Response } from 'express';
import Job from '../models/Job';
import { protect, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/jobs
// @desc    Get all jobs for logged in user
// @access  Private
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, priority, search } = req.query;
    
    let query: any = { user: req.user!._id };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { position: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query)
      .populate('company', 'name logo')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job
// @access  Private
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id).populate('company');

    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found'
      });
      return;
    }

    // Make sure user owns job
    if (job.user.toString() !== req.user!._id.toString()) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
      return;
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    req.body.user = req.user!._id;
    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found'
      });
      return;
    }

    // Make sure user owns job
    if (job.user.toString() !== req.user!._id.toString()) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
      return;
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found'
      });
      return;
    }

    // Make sure user owns job
    if (job.user.toString() !== req.user!._id.toString()) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
      return;
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

export = router;
