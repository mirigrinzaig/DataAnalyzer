const express = require("express");
const router = express.Router();
const { handleCheckout } = require("../controllers/autoReorderController");

router.post("/", handleCheckout);

module.exports = router;