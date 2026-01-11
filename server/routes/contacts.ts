import express, { Router, Response } from 'express';
import Contact from '../models/Contact';
import { protect, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

router.use(protect);

// @route   GET /api/contacts
// @desc    Get all contacts for logged in user
// @access  Private
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contacts = await Contact.find({ user: req.user!._id })
      .populate('company', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

// @route   POST /api/contacts
// @desc    Create a new contact
// @access  Private
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    req.body.user = req.user!._id;
    const contact = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

// @route   PUT /api/contacts/:id
// @desc    Update a contact
// @access  Private
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
      return;
    }

    if (contact.user.toString() !== req.user!._id.toString()) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
      return;
    }

    contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact
// @access  Private
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
      return;
    }

    if (contact.user.toString() !== req.user!._id.toString()) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
      return;
    }

    await contact.deleteOne();

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
});

export = router;
