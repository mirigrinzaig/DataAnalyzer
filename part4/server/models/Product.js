const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  minimumOrderQty: {
    type: Number,
    required: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
