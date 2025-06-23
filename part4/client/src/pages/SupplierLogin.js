import React, { useState } from 'react';
import axios from 'axios';

const SupplierLogin = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    role: 'Supplier'
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:2025/api/auth/login', formData);
      // שמירת פרטי המשתמש בזיכרון מקומי
      localStorage.setItem('supplierId', res.data._id);
      alert('התחברת בהצלחה!');
      // ניווט בהמשך לעמוד הבית
    } catch (err) {
      alert('שגיאה בהתחברות');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>כניסת ספק</h2>
      <input
        name="phoneNumber"
        placeholder="מספר טלפון"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="סיסמה"
        onChange={handleChange}
      />
      <button type="submit">כניסה</button>
    </form>
  );
};

export default SupplierLogin;
