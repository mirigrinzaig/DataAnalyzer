const Order = require("../models/Order");
const Supplier = require("../models/Supplier");
const Product = require("../models/Product");

const getOrders = async (req, res) => {
    const limit = parseInt(req.query.limit) || 0;
    try {
        const orders = await Order.find({})
            .limit(limit)
            .populate('supplierId', 'companyName')
            .populate('products.productId', 'productName price')
            .lean();
        if (!orders.length) {
            return res.status(404).json({
                error: true,
                message: "No orders found",
                data: null
            });
        }
        res.json({
            error: false,
            message: "Orders found",
            data: orders
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            data: null
        });
    }
};

const getSupplierOrders = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const orders = await Order.find({ supplierId }).populate('products.productId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders', details: err });
    }
};

const getOrder = async (req, res) => {
    const { _id } = req.params;
    try {
        const order = await Order.findById(_id)
            .populate('supplierId', 'companyName')
            .populate('products.productId', 'productName price')
            .lean();
        if (!order) {
            return res.status(404).json({
                error: true,
                message: "Order not found",
                data: null
            });
        }
        res.json({
            error: false,
            message: "Order found",
            data: order
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            data: null
        });
    }
};


const approveOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByIdAndUpdate(orderId, { status: 'inProgress' }, { new: true });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Failed to approve order', details: err });
    }
};

const completeOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByIdAndUpdate(orderId, { status: 'completed' }, { new: true });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Failed to complete order', details: err });
    }
};

module.exports = { getOrders, getSupplierOrders, getOrder, approveOrder, completeOrder };