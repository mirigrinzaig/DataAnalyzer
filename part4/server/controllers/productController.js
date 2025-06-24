const Product = require("../models/Product");

const getProducts = async (req, res) => {
    
    try {
        const products = await Product.find().populate("supplierId", "companyName");
        if (!products.length) {
            return res.status(404).json({
                error: true,
                message: "No products found",
                data: null
            });
        }
        res.json({
            error: false,
            message: "Products found",
            data: products
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            data: null
        });
    }
};

const getProduct = async (req, res) => {
    const { _id } = req.params;
    try {
        const product = await Product.findById(_id).lean();
        if (!product) {
            return res.status(404).json({
                error: true,
                message: "Product not found",
                data: null
            });
        }
        res.json({
            error: false,
            message: "Product found",
            data: product
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            data: null
        });
    }
};

const getSupplierProducts = async (req, res) => {
     const limit = parseInt(req.query.limit) || 0;
    try {
        const { supplierId } = req.params;
        const products = await Product.find({ supplierId});
        if (!products.length) {
            return res.status(404).json({
                error: true,
                message: "No products found",
                data: null
            });
        }
        res.json({
            error: false,
            message: "Products found",
            data: products
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            data: null
        });
    }
};
const addProduct = async (req, res) => {
    const { productName, pricePerUnit, minimumOrderQty, supplierId } = req.body;
    if (!productName || !pricePerUnit || !minimumOrderQty) {
        return res.status(400).json({
            error: true,
            message: "Product name, price, and minimum quantity are required",
            data: null
        });
    }
    try {
        // Checking for duplicates
        const existingProduct = await Product.findOne({
            productName,
            pricePerUnit
        });

        if (existingProduct) {
            return res.status(400).json({ message: 'Product already exists, check the product list.'+productName });
        }
        const product = await Product.create({ productName, pricePerUnit, minimumOrderQty, supplierId });
        res.status(201).json({
            error: false,
            message: "New product created " + productName,
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({
            error: true,
            message: error.message,
            data: null
        });
    }
};

const getCheapestSupplierForProduct = async (req, res) => {
  const { name } = req.params;

  try {
    const cheapest = await Product.find({ name })
      .sort({ pricePerUnit: 1 })
      .limit(1)
      .populate('supplierId');

    if (cheapest.length === 0) {
      return res.status(404).json({ message: "לא נמצא ספק למוצר זה" });
    }

    return res.status(200).json({
      product: cheapest[0].productName,
      price: cheapest[0].pricePerUnit,
      minQuantity: cheapest[0].minimumOrderQty,
      supplier: {
        id: cheapest[0].supplierId._id,
        companyName: cheapest[0].supplierId.companyName
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "שגיאה בשרת" });
  }
};

module.exports = {
    getProducts,
    getProduct,
    addProduct,
    getSupplierProducts,
    getCheapestSupplierForProduct
};