import express from 'express';
import { FinancialReport } from '../models/FinancialReport';
import { auth, checkRole } from '../middleware/auth';
import { calculateTax } from '../utils/taxCalculator';

const router = express.Router();

// Submit financial report (business only)
router.post('/submit', auth, checkRole(['business']), async (req, res) => {
  try {
    const {
      business,
      year,
      quarter,
      revenue,
      expenses
    } = req.body;

    // Calculate net income
    const netIncome = revenue - expenses;

    // Calculate tax amount
    const taxAmount = calculateTax(revenue);

    // Create financial report
    const report = new FinancialReport({
      business,
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
router.get('/', auth, checkRole(['government']), async (req, res) => {
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
router.get('/business/:businessId', auth, async (req, res) => {
  try {
    const reports = await FinancialReport.find({ business: req.params.businessId })
      .populate('submittedBy', 'name email');
    res.json(reports);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching financial reports' });
  }
});

// Update report status (government worker only)
router.patch('/:id/status', auth, checkRole(['government']), async (req, res) => {
  try {
    const { status } = req.body;
    const report = await FinancialReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(400).json({ error: 'Error updating report status' });
  }
});

// Update tax status
router.patch('/:id/tax-status', auth, async (req, res) => {
  try {
    const { taxStatus } = req.body;
    const report = await FinancialReport.findByIdAndUpdate(
      req.params.id,
      { taxStatus },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(400).json({ error: 'Error updating tax status' });
  }
});

export default router; 