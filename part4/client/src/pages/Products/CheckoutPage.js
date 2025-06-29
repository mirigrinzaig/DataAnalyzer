import { useState, useEffect } from 'react';
import './CheckoutPage.css';

const CheckoutPage= () => {
  const [stockItems, setStockItems] = useState([]);
  const [cart, setCart] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:2025/api/stock")
      .then((res) => res.json())
      .then((data) => setStockItems(data))
      .catch((err) => {
        console.error(err);
        setStockItems();
      });
    console.log(stockItems);

  }, []);

  const handleChange = (productName, value) => {
    setCart(prev => ({
      ...prev,
      [productName]: Number(value)
    }));
  };

  const handleSubmit = async () => {
    const cleanedCart = {};
    for (let id in cart) {
      const quantity = cart[id];
      if (quantity > 0) cleanedCart[id] = quantity;
    }

    if (Object.keys(cleanedCart).length === 0) {
      setMessage("לא נבחרו פריטים לרכישה");
      return;
    }

    try {
      const response = await fetch("http://localhost:2025/api/autoReorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedCart)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ הקנייה בוצעה בהצלחה!");
        setCart({});
      } else {
        setMessage("❌ שגיאה: " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ שגיאה כללית בשליחה לשרת");
    }
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">קופה</h2>

      {stockItems.length === 0 ? (
        <p className="loading-message">טוען פרטי מלאי...</p>
      ) : (
        <>
          {Array.isArray(stockItems) && stockItems.map((item) => (
            <div key={item._id} className="stock-item">
              <div className="stock-details">
                <div className="stock-name">
                  {item.productId?.productName || "לא זמין"}
                </div>
                <div className="stock-company">
                  חברה: {item.productId?.supplierId?.companyName || "לא זמין"}
                </div>
                <div className="stock-quantity">

                  במלאי: <span>{item.currentQuantity}</span>
                </div>
              </div>
              <input
                className="stock-input"
                type="number"
                min="0"
                value={cart[item.productId?.productName] || ""}
                onChange={(e) => handleChange(item.productId?.productName, e.target.value)}
              />
            </div>
          ))}

          <button onClick={handleSubmit} className="checkout-button">
            שלם
          </button>

          {message && (
            <p className="checkout-message">{message}</p>
          )}
        </>
      )}
    </div>
  );
}
export default CheckoutPage;