const Stock = require("../models/Stock");
const Product = require("../models/Product");
const Order = require("../models/Order");

const handleCheckout = async (req, res) => {
  try {
    const purchases = req.body; // דוגמה: { "לחם": 1, "חלב": 2 }

    for (const productName in purchases) {
      const quantityPurchased = Number(purchases[productName]);

      const allStocks = await Stock.find().populate("productId");
      const stockItem = allStocks.find(item => item.productId?.productName === productName);
      if (!allStocks || !stockItem) {
        console.log(` לא נמצא פריט מלאי בשם: ${productName}`);
        continue;
      }

      // עדכון המלאי
      stockItem.currentQuantity = Math.max(0, stockItem.currentQuantity - quantityPurchased);
      await stockItem.save();

      // בדיקה אם צריך להזמין מחדש
      if (stockItem.currentQuantity < stockItem.minimumQuantity) {
        // מציאת המוצר הזול ביותר לאותו שם
        const cheapestProduct = await Product.find({ productName })
          .sort({ pricePerUnit: 1 })
          .limit(1)
          .populate("supplierId");

        if (!cheapestProduct.length || !cheapestProduct[0].supplierId) {
          console.log(` אין ספק זמין עבור "${productName}"`);
          continue;
        }

        const bestProduct = cheapestProduct[0];
        const supplier = bestProduct.supplierId;

        // יצירת הזמנה
        const quantityToOrder = stockItem.minimumQuantity * 2;

        const order = new Order({
          supplierId: supplier._id,
          products: [{
            productId: bestProduct._id,
            quantity: quantityToOrder
          }],
          status: "pending"
        });

        await order.save();
        console.log(` בוצעה הזמנה אוטומטית ל-${productName} מהספק ${supplier.companyName}`);
      }
    }

    res.json({ success: true, message: "המלאי עודכן והוזמנו מוצרים חסרים לפי הצורך." });
  } catch (err) {
    console.error("שגיאה ב-checkout:", err);
    res.status(500).json({ success: false, message: "שגיאה בטיפול בקופה." });
  }
};

module.exports = { handleCheckout };
