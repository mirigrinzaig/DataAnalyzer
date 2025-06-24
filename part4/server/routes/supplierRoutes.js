const express = require('express');
const router = express.Router();
const { getAllSuppliers} = require('../controllers/supplierController');



router.get('/', getAllSuppliers);

module.exports = router;
