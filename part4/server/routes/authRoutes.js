const express = require('express');
const router = express.Router();
const {
  registerOwner,
  registerSupplier,
  login
} = require('../controllers/authController');

router.post('/register/owner', registerOwner);
router.post('/register/supplier', registerSupplier);
router.post('/login', login);

module.exports = router;
