const Supplier = require('../models/Supplier');




const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find(); 
    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בעת שליפת ספקים', details: err });
  }
};




module.exports = {
  getAllSuppliers
};
