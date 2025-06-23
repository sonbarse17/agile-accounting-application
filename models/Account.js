const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense']
  },
  subtype: {
    type: String,
    required: true,
    enum: [
      'Current Asset', 'Fixed Asset', 'Current Liability', 'Long-term Liability',
      'Owner Equity', 'Operating Revenue', 'Other Revenue', 'Operating Expense', 
      'Other Expense'
    ]
  },
  parentAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    default: null
  },
  balance: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

accountSchema.index({ code: 1 });
accountSchema.index({ type: 1 });

module.exports = mongoose.model('Account', accountSchema);