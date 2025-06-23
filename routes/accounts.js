const express = require('express');
const { body, validationResult } = require('express-validator');
const Account = require('../models/Account');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all accounts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, active, search } = req.query;
    let query = {};

    if (type) query.type = type;
    if (active !== undefined) query.isActive = active === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    const accounts = await Account.find(query)
      .populate('parentAccount', 'name code')
      .sort({ code: 1 });

    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get account by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const account = await Account.findById(req.params.id)
      .populate('parentAccount', 'name code');

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ account });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new account
router.post('/', [
  authenticateToken,
  authorizeRoles('admin', 'accountant'),
  body('code').notEmpty().trim().escape(),
  body('name').notEmpty().trim().escape(),
  body('type').isIn(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense']),
  body('subtype').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingAccount = await Account.findOne({ code: req.body.code });
    if (existingAccount) {
      return res.status(400).json({ error: 'Account code already exists' });
    }

    const account = new Account(req.body);
    await account.save();

    res.status(201).json({
      message: 'Account created successfully',
      account
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update account
router.put('/:id', [
  authenticateToken,
  authorizeRoles('admin', 'accountant'),
  body('name').optional().trim().escape(),
  body('description').optional().trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const account = await Account.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({
      message: 'Account updated successfully',
      account
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete account
router.delete('/:id', [
  authenticateToken,
  authorizeRoles('admin')
], async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Check if account has transactions (you'd implement this check)
    // For now, just soft delete by setting isActive to false
    account.isActive = false;
    await account.save();

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;