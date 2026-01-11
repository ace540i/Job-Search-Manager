import express, { Router, Response } from 'express';
import Company from '../models/Company';
import { protect, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

router.use(protect);

// @route   GET /api/companies
// @desc    Get all companies for logged in user
// @access  Private
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const companies = await Company.find({ user: req.user!._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: companies.length,
      companies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

// @route   GET /api/companies/:id
// @desc    Get single company
// @access  Private
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404).json({
        success: false,
        message: 'Company not found'
      });
      return;
    }

    if (company.user.toString() !== req.user!._id.toString()) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
      return;
    }

    res.json({
      success: true,
      company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

// @route   POST /api/companies
// @desc    Create a new company
// @access  Private
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    req.body.user = req.user!._id;
    const company = await Company.create(req.body);

    res.status(201).json({
      success: true,
      company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

// @route   PUT /api/companies/:id
// @desc    Update a company
// @access  Private
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404).json({
        success: false,
        message: 'Company not found'
      });
      return;
    }

    if (company.user.toString() !== req.user!._id.toString()) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
      return;
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

// @route   DELETE /api/companies/:id
// @desc    Delete a company
// @access  Private
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404).json({
        success: false,
        message: 'Company not found'
      });
      return;
    }

    if (company.user.toString() !== req.user!._id.toString()) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
      return;
    }

    await company.deleteOne();

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

export = router;
