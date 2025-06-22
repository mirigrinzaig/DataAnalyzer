const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'Owner'
  }
}, { timestamps: true });

module.exports = mongoose.model('Owner', ownerSchema);
