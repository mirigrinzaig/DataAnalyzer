const express = require('express');
const router = express.Router();
const {
  registerOwner,
  registerSupplier,
  login,
  registerSupplierWithProducts,
  loginEveryone
} = require('../controllers/authController');

router.post('/register/owner', registerOwner);
router.post('/register/supplier', registerSupplierWithProducts);
router.post('/login', loginEveryone);

module.exports = router;
