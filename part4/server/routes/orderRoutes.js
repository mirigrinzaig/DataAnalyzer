const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();

//router.get("/", orderController.getOrders);
//router.get("/:_id", orderController.getOrder);
router.post("/", orderController.createOrder);
router.get("/supplier/:supplierId",orderController.getSupplierOrders)
//router.put("/status", orderController.updateOrderStatus);
router.put('/:orderId/approve', orderController.approveOrder); // אישור הזמנה
router.put('/:orderId/complete', orderController.completeOrder);

module.exports = router;