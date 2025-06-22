const mongoose = require('mongoose');

const warningSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['NoSuppliers', 'NoSuitableSupplier', 'LowStock', 'Other'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  stockItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock'
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Resolved', 'Dismissed'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Warning', warningSchema);
