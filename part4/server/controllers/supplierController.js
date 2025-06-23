const Supplier = require('../models/Supplier');

const createSupplier = async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body);
    await newSupplier.save();
    res.status(201).json({ message: 'Supplier created', data: newSupplier });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create supplier', details: err });
  }
};

module.exports = {
   createSupplier
};
