import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderProductsPage.css";

const OrderProductsPage= () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProducts, setSelectedProducts] = useState({});
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const navigate = useNavigate();

  // שליפת רשימת ספקים
  useEffect(() => {
    setLoadingSuppliers(true);
    fetch("http://localhost:2025/api/suppliers")
      .then((res) => res.json())
      .then((data) => {
        console.log("Suppliers response:", data);
        if (Array.isArray(data)) {
          setSuppliers(data);
        } else if (Array.isArray(data.data)) {
          setSuppliers(data.data);
        } else {
          console.error("מבנה לא צפוי בתשובת ספקים:", data);
          setSuppliers([]);
        }
      })
      .catch((err) => console.error("שגיאה בהבאת ספקים:", err))
      .finally(() => setLoadingSuppliers(false));
  }, []);

  // שליפת מוצרים לספק שנבחר
  useEffect(() => {
    if (!selectedSupplier) {
      setProducts([]);
      return;
    }

    setLoadingProducts(true);
    console.log("טוען מוצרים לספק עם ID:", selectedSupplier);

    fetch(`http://localhost:2025/api/products/supplier/${selectedSupplier}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("מוצרים שהתקבלו:", data);
        if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          console.error("מבנה לא צפוי בתשובת מוצרים:", data);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("שגיאה בהבאת מוצרים לספק:", err);
        setProducts([]);
      })
      .finally(() => setLoadingProducts(false));
  }, [selectedSupplier]);

  const handleProductQuantityChange = (productId, quantity) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: quantity
    }));
  };

  const handleSubmit = async () => {
    const orderItems = Object.entries(selectedProducts)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({
        productId: id,
        quantity: Number(qty)
      }));

    if (!selectedSupplier || orderItems.length === 0) {
      alert("בחר ספק והזן כמות למוצר אחד לפחות");
      return;
    }

    const res = await fetch("http://localhost:2025/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplierId: selectedSupplier,
        products: orderItems
      })
    });

    if (res.ok) {
      alert("ההזמנה נשלחה בהצלחה");
      navigate("/admin");
    } else {
      alert("שגיאה בשליחת ההזמנה");
    }
  };


  return (
    <div className="order-page-container">
      <h2>יצירת הזמנה חדשה</h2>

      {loadingSuppliers ? (
        <p>טוען ספקים...</p>
      ) : (
        <>
          <label>בחר ספק:</label><br />
          <select
            onChange={(e) => {
              setSelectedSupplier(e.target.value);
              setSelectedProducts({});
            }}
            value={selectedSupplier}
            style={{ marginBottom: 20 }}
          >
            <option value="">--בחר--</option>
            {suppliers.map((sup) => (
              <option key={sup._id} value={sup._id}>
                {sup.companyName}
              </option>
            ))}
          </select>
        </>
      )}

      {loadingProducts && <p>טוען מוצרים לספק...</p>}

      {products.length > 0 && !loadingProducts && (
        <>
          <h3>בחר מוצרים להזמנה:</h3>
          {products.map((p) => (
            <div key={p._id} className="product-item">
              <label>
                {p.productName} – מחיר: ₪{p.pricePerUnit} (מינימום: {p.minimumOrderQty})
              </label><br />
              <input
                type="number"
                min={p.minimumOrderQty}
                placeholder="כמות"
                value={selectedProducts[p._id] || ""}
                onChange={(e) => handleProductQuantityChange(p._id, e.target.value)}
              />
            </div>
          ))}
        </>
      )}

      {selectedSupplier && products.length > 0 && !loadingProducts && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={handleSubmit} style={{ marginTop: 20 }}>
            שלח הזמנה
          </button></div>
      )}

      <hr />

    </div>
  );
}

export default OrderProductsPage;
