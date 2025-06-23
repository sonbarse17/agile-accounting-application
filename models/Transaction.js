const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionNumber: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  reference: {
    type: String,
    trim: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  entries: [{
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    debit: {
      type: Number,
      default: 0,
      min: 0
    },
    credit: {
      type: Number,
      default: 0,
      min: 0
    },
    description: String
  }],
  status: {
    type: String,
    enum: ['draft', 'posted', 'reversed'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  postedAt: Date,
  reversedAt: Date
});

// Validate that debits equal credits
transactionSchema.pre('save', function(next) {
  const totalDebits = this.entries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredits = this.entries.reduce((sum, entry) => sum + entry.credit, 0);
  
  if (Math.abs(totalDebits - totalCredits) > 0.01) {
    return next(new Error('Total debits must equal total credits'));
  }
  next();
});

transactionSchema.index({ date: -1 });
transactionSchema.index({ transactionNumber: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);