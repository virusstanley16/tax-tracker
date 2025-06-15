import express from 'express';
import { Business } from '../models/Business';
import { auth, checkRole } from '../middleware/auth';

const router = express.Router();

// Register new business (government worker only)
router.post('/register', auth, checkRole(['government']), async (req, res) => {
  try {
    const {
      name,
      ownerName,
      email,
      address,
      phone,
      businessType
    } = req.body;

    // Check if business already exists
    const existingBusiness = await Business.findOne({ email });
    if (existingBusiness) {
      return res.status(400).json({ error: 'Business already registered' });
    }

    // Create new business
    const business = new Business({
      name,
      ownerName,
      email,
      address,
      phone,
      businessType,
      registeredBy: req.user._id
    });

    await business.save();
    res.status(201).json(business);
  } catch (error) {
    res.status(400).json({ error: 'Error registering business' });
  }
});

// Get all businesses (government worker only)
router.get('/', auth, checkRole(['government']), async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate('registeredBy', 'name email');
    res.json(businesses);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching businesses' });
  }
});

// Get business by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('registeredBy', 'name email');
    
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json(business);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching business' });
  }
});

// Update business status (government worker only)
router.patch('/:id/status', auth, checkRole(['government']), async (req, res) => {
  try {
    const { status } = req.body;
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json(business);
  } catch (error) {
    res.status(400).json({ error: 'Error updating business status' });
  }
});

export default router; 