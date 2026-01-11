import express, { Router, Response } from 'express';
import Document from '../models/Document';
import { protect, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

router.use(protect);

// @route   GET /api/documents
// @desc    Get all documents for logged in user
// @access  Private
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const documents = await Document.find({ user: req.user!._id })
      .populate('job', 'position')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

// @route   POST /api/documents
// @desc    Create a new document
// @access  Private
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    req.body.user = req.user!._id;
    const document = await Document.create(req.body);

    res.status(201).json({
      success: true,
      document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      res.status(404).json({
        success: false,
        message: 'Document not found'
      });
      return;
    }

    if (document.user.toString() !== req.user!._id.toString()) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
      return;
    }

    await document.deleteOne();

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

export = router;
