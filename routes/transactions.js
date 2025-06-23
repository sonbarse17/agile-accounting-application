const express = require('express');
const { body, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all transactions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    let query = {};

    if (status) query.status = status;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('entries.account', 'name code type')
      .populate('createdBy', 'username')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('entries.account', 'name code type')
      .populate('createdBy', 'username');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new transaction
router.post('/', [
  authenticateToken,
  authorizeRoles('admin', 'accountant'),
  body('description').notEmpty().trim().escape(),
  body('entries').isArray({ min: 2 }),
  body('entries.*.account').isMongoId(),
  body('entries.*.debit').isNumeric().optional(),
  body('entries.*.credit').isNumeric().optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Generate transaction number
    const count = await Transaction.countDocuments();
    const transactionNumber = `TXN-${String(count + 1).padStart(6, '0')}`;

    // Validate entries
    const totalDebits = req.body.entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const totalCredits = req.body.entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      return res.status(400).json({ error: 'Total debits must equal total credits' });
    }

    const transaction = new Transaction({
      ...req.body,
      transactionNumber,
      totalAmount: totalDebits,
      createdBy: req.user._id
    });

    await transaction.save();
    await transaction.populate('entries.account', 'name code type');

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post transaction (change status from draft to posted)
router.patch('/:id/post', [
  authenticateToken,
  authorizeRoles('admin', 'accountant')
], async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.status !== 'draft') {
      return res.status(400).json({ error: 'Only draft transactions can be posted' });
    }

    // Update account balances
    for (const entry of transaction.entries) {
      const account = await Account.findById(entry.account);
      if (account) {
        // Debit increases assets/expenses, decreases liabilities/equity/revenue
        // Credit increases liabilities/equity/revenue, decreases assets/expenses
        if (['Asset', 'Expense'].includes(account.type)) {
          account.balance += entry.debit - entry.credit;
        } else {
          account.balance += entry.credit - entry.debit;
        }
        await account.save();
      }
    }

    transaction.status = 'posted';
    transaction.postedAt = new Date();
    await transaction.save();

    res.json({
      message: 'Transaction posted successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;