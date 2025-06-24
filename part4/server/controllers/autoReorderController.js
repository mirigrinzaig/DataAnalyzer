const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const Order = require("../models/Order");

const handleCheckout = async (req, res) => {
  try {
    const purchases = req.body;

    for (let productName in purchases) {
      const quantityPurchased = purchases[productName];
      const product = await Product.findOne({ name: productName });

      if (!product) continue;

      product.stock = Math.max(0, product.stock - quantityPurchased);
      await product.save();

      if (product.stock < product.minQuantity) {
       const cheapest = await Product.find({ name: product.name })
          .sort({ pricePerUnit: 1 })
          .limit(1)
          .populate("supplierId");

        if (cheapest.length === 0 || !cheapest[0].supplierId) {
          console.log("⚠️ אין ספק פעיל למוצר: " + product.name);
          continue;
        }
        const cheapestProduct = cheapest[0];
        const supplier = cheapestProduct.supplierId;

        const quantityToOrder = product.minQuantity * 2;

        const order = new Order({
          supplierId: supplier._id,
          supplierName: supplier.companyName,
          products: [{ name: product.productName, quantity: quantityToOrder }],
          status: "בתהליך"
        });

        await order.save();
        console.log(`✅ הזמנה אוטומטית ל-${product.name} מהספק ${supplier.companyName}`);
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "שגיאה בעיבוד קופה" });
  }
};

module.exports = { handleCheckout };
