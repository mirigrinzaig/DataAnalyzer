import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SupplierRegister.css'

const SupplierRegister = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    phoneNumber: '',
    representativeName: '',
    password: ''
  });

  const [products, setProducts] = useState([{ name: '', pricePerUnit: '', minQuantity: '' }]);
  const handleProductChange = (index, e) => {
    const updated = [...products];
    updated[index][e.target.name] = e.target.value;
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([...products, { name: '', pricePerUnit: '', minQuantity: '' }]);
  };



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:2025/api/auth/register/supplier', {
        ...formData,
        products: products.map(p => ({
          productName: p.name,
          pricePerUnit: Number(p.pricePerUnit),
          minimumOrderQty: Number(p.minQuantity)
        }))
      });
      navigate('/supplier');
      alert('ההרשמה בוצעה בהצלחה!');
    } catch (err) {
      alert('שגיאה בהרשמה');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className='title-register'>רישום ספק</h2>
      <input name="companyName" placeholder="שם החברה" onChange={handleChange} />
      <input name="phoneNumber" placeholder="מספר טלפון" onChange={handleChange} />
      <input name="representativeName" placeholder="שם הנציג" onChange={handleChange} />
      <input type="password" name="password" placeholder="סיסמה" onChange={handleChange} />
      <h3>רשימת מוצרים</h3>
      {products.map((product, idx) => (
        <div key={idx}>
          <input
            name="name"
            placeholder="שם המוצר"
            value={product.name}
            onChange={(e) => handleProductChange(idx, e)}
          />
          <input
            name="pricePerUnit"
            type="number"
            placeholder="מחיר ליחידה"
            value={product.pricePerUnit}
            onChange={(e) => handleProductChange(idx, e)}
          />
          <input
            name="minQuantity"
            type="number"
            placeholder="כמות מינימלית"
            value={product.minQuantity}
            onChange={(e) => handleProductChange(idx, e)}
          />
        </div>
      ))}
      <button type="button" onClick={addProduct}>הוסף מוצר</button>

      <button type="submit">רישום</button>
    </form>
  );
};

export default SupplierRegister;
