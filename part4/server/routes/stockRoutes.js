const express = require('express');
const router = express.Router();
const Stock = require("../models/Stock");

router.get("/", async (req, res) => {
  try {
    const stockItems = await Stock.find()
      .populate({
        path: "productId",
        populate: {
          path: "supplierId", // זה חייב להיות מוגדר כ־ref במודל מוצר
          model: "Supplier"   // שם המודל של הספקים
        }
      });

    res.json(stockItems);
  } catch (err) {
    res.status(500).json({ error: "שגיאה בקבלת מלאי" });
  }
});


// יצירת רשומת מלאי חדשה
router.post("/", async (req, res) => {
  try {
    const { productId, currentQuantity, minimumQuantity } = req.body;

    if (!minimumQuantity) {
      return res.status(400).json({ error: "יש להזין  כמות מינימום" });
    }

    if (!productId) {
      return res.status(400).json({ error: "יש להזין  מזההם" });
    }


    const existing = await Stock.findOne({ productId });
    if (existing) {
      return res.status(400).json({ error: "מלאי עם מזהה זה כבר קיים" });
    }

    const newStock = new Stock({
      productId,
      currentQuantity: currentQuantity || minimumQuantity, // התחלה לפי מינימום
      minimumQuantity
    });

    await newStock.save();
    res.status(201).json({ message: "פריט מלאי נוצר בהצלחה", data: newStock });
  } catch (err) {
    console.error("שגיאה ביצירת מלאי:", err);
    res.status(500).json({ error: "שגיאת שרת" });
  }
});


module.exports = router;
