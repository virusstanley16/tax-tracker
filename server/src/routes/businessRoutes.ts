import express from 'express';
import {
  getAllBusinesses,
  getBusinessById,
  createBusiness,
  updateBusinessStatus,
  getBusinessOwners,
  searchBusinesses,
} from '../controllers/businessController';
import { isAuthenticated, isGovernment } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/owners', getBusinessOwners);
router.get('/search', searchBusinesses);

// Protected routes
router.get('/', isAuthenticated, getAllBusinesses);
router.get('/:id', isAuthenticated, getBusinessById);
router.post('/', isAuthenticated, isGovernment, createBusiness);
router.patch('/:id/status', isAuthenticated, isGovernment, updateBusinessStatus);

export default router; 