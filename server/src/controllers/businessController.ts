import { Request, Response } from 'express';
import { Business } from '../models/Business';
import { User } from '../models/User';

// Get all businesses
export const getAllBusinesses = async (req: Request, res: Response) => {
  try {
    const businesses = await Business.find()
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching businesses' });
  }
};

// Get business by ID
export const getBusinessById = async (req: Request, res: Response) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('ownerId', 'name email');
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching business' });
  }
};

// Create new business
export const createBusiness = async (req: Request, res: Response) => {
  try {
    const { name, type, registrationNumber, ownerId } = req.body;

    // Check if business owner exists
    const owner = await User.findOne({ _id: ownerId, role: 'business' });
    if (!owner) {
      return res.status(400).json({ message: 'Invalid business owner' });
    }

    // Check if registration number is unique
    const existingBusiness = await Business.findOne({ registrationNumber });
    if (existingBusiness) {
      return res.status(400).json({ message: 'Registration number already exists' });
    }

    const business = new Business({
      name,
      type,
      registrationNumber,
      ownerId,
      status: 'active',
      taxStatus: 'pending',
    });

    await business.save();

    // Update user with businessId
    await User.findByIdAndUpdate(ownerId, { businessId: business._id });

    res.status(201).json(business);
  } catch (error) {
    res.status(500).json({ message: 'Error creating business' });
  }
};

// Update business status
export const updateBusinessStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    business.status = status;
    await business.save();

    res.json(business);
  } catch (error) {
    res.status(500).json({ message: 'Error updating business status' });
  }
};

// Get business owners for selection
export const getBusinessOwners = async (req: Request, res: Response) => {
  try {
    const owners = await User.find({ role: 'business' })
      .select('name email')
      .sort({ name: 1 });
    res.json(owners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching business owners' });
  }
};

// Search businesses
export const searchBusinesses = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const businesses = await Business.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { registrationNumber: { $regex: query, $options: 'i' } },
      ],
    })
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: 'Error searching businesses' });
  }
}; 