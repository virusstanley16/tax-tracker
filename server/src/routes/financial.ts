import express, { Response } from 'express';
import { FinancialReport } from '../models/FinancialReport';
import { auth, checkRole, AuthRequest } from '../middleware/auth';
import { calculateTax } from '../utils/taxCalculator';
import { User } from '../models/User';

const router = express.Router();

// Submit financial report (business only)
router.post('/submit', auth, checkRole(['business']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      year,
      quarter,
      revenue,
      expenses
    } = req.body;

    // Get the business profile from the authenticated user
    const user = await User.findById(req.user._id).populate('businessProfile');
    
    if (!user?.businessProfile) {
      res.status(400).json({ error: 'No business profile found for this user' });
      return;
    }

    // Calculate net income
    const netIncome = revenue - expenses;

    // Calculate tax amount
    const taxAmount = calculateTax(revenue);

    // Create financial report
    const report = new FinancialReport({
      business: user.businessProfile._id,
      year,
      quarter,
      revenue,
      expenses,
      netIncome,
      taxAmount,
      submittedBy: req.user._id
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: 'Error submitting financial report' });
  }
});

// Get all financial reports (government worker only)
router.get('/', auth, checkRole(['government']), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reports = await FinancialReport.find()
      .populate('business', 'name ownerName')
      .populate('submittedBy', 'name email');
    res.json(reports);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching financial reports' });
  }
});

// Get financial reports for a specific business
router.get('/business/:businessId', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reports = await FinancialReport.find({ business: req.params.businessId })
      .populate('submittedBy', 'name email');
    res.json(reports);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching financial reports' });
  }
});

// Update report status (government worker only)
router.patch('/:id/status', auth, checkRole(['government']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const report = await FinancialReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    res.json(report);
  } catch (error) {
    res.status(400).json({ error: 'Error updating report status' });
  }
});

// Update tax status
router.patch('/:id/tax-status', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taxStatus } = req.body;
    const report = await FinancialReport.findByIdAndUpdate(
      req.params.id,
      { taxStatus },
      { new: true }
    );

    if (!report) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    res.json(report);
  } catch (error) {
    res.status(400).json({ error: 'Error updating tax status' });
  }
});

export default router; 