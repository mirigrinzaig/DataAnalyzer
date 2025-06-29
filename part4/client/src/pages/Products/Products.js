import axios from 'axios';
import { useEffect, useState } from "react";
import './Products.css'

const Products=()=>{
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:2025/api/products")
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="products-container">
      
      <h2 className="products-title">המוצרים שלנו</h2>
      <div className="products-grid">
        {Array.isArray(products) && products.map((p) => (
          <div key={p._id} className="product-card">
            <img src="/grocery-cart.png" alt={p.productName}  className="product-image"/>
            <h3 className="product-name">{p.productName}</h3>
            <p><b>מחיר:</b> ₪{p.pricePerUnit}</p>
            <p><b>חברה:</b> {p.supplierId?.companyName || "שגיאה בשם הספק"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products
