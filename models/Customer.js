const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  creditLimit: {
    type: Number,
    default: 0
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  paymentTerms: {
    type: String,
    enum: ['Net 30', 'Net 60', 'Due on Receipt', 'COD'],
    default: 'Net 30'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

customerSchema.index({ customerNumber: 1 });
customerSchema.index({ name: 1 });

module.exports = mongoose.model('Customer', customerSchema);