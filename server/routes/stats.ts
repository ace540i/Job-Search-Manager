import express, { Router, Response } from 'express';
import mongoose from 'mongoose';
import Job from '../models/Job';
import Interview from '../models/Interview';
import { protect, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

router.use(protect);

// @route   GET /api/stats
// @desc    Get statistics for dashboard
// @access  Private
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!._id.toString());

    // Job statistics by status
    const jobsByStatus = await Job.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Total jobs
    const totalJobs = await Job.countDocuments({ user: userId });

    // Active applications (Applied, Interview, Offer)
    const activeApplications = await Job.countDocuments({
      user: userId,
      status: { $in: ['Applied', 'Interview', 'Offer'] }
    });

    // Upcoming interviews
    const upcomingInterviews = await Interview.countDocuments({
      user: userId,
      scheduledDate: { $gte: new Date() },
      status: 'Scheduled'
    });

    // Response rate
    const appliedJobs = await Job.countDocuments({
      user: userId,
      status: { $in: ['Applied', 'Interview', 'Offer', 'Accepted'] }
    });

    const respondedJobs = await Job.countDocuments({
      user: userId,
      status: { $in: ['Interview', 'Offer', 'Accepted', 'Rejected'] }
    });

    const responseRate = appliedJobs > 0 ? Math.round((respondedJobs / appliedJobs) * 100) : 0;

    // Recent activity
    const recentJobs = await Job.find({ user: userId })
      .populate('company', 'name logo')
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalJobs,
        activeApplications,
        upcomingInterviews,
        responseRate,
        jobsByStatus,
        recentJobs
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

export = router;
