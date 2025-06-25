const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: false
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    unique: true
  },
  currentQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  minimumQuantity: {
    type: Number,
    required: true
  }
 
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);
