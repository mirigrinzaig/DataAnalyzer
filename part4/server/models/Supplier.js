const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  representativeName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'Supplier'
  },
  goodsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
