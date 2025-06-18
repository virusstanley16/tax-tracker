import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Register new user
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Create new user
    const user = new User({
      email,
      password,
      role,
      name
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Populate business profile if user is a business user
    if (role === 'business') {
      await user.populate('businessProfile');
    }

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Populate business profile if user is a business user
    if (user.role === 'business') {
      await user.populate('businessProfile');
    }

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: 'Error logging in' });
  }
});

// Get current user
router.get('/me', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Populate business profile if user is a business user
    if (user.role === 'business') {
      await user.populate('businessProfile');
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching user' });
  }
});

// Get all business users
router.get('/business-users', auth, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const businessUsers = await User.find({ role: 'business' })
      .select('_id name email')
      .lean();
    res.json(businessUsers);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching business users' });
  }
});

export default router; 