import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    companyName: '',
    phone: '',
    contactName: '',
    products: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const supplierData = {
      companyName: form.companyName,
      phone: form.phone,
      contactName: form.contactName,
      products: form.products.split(',').map(p => p.trim()),
    };
    try {
      await axios.post('/api/suppliers/register', supplierData);
      navigate('/');
    } catch (err) {
      alert('שגיאה בהרשמה');
    }
  };

  return (
    <div>
      <h2>הרשמת ספק</h2>
      <input placeholder="שם חברה" onChange={e => setForm({ ...form, companyName: e.target.value })} />
      <input placeholder="מספר טלפון" onChange={e => setForm({ ...form, phone: e.target.value })} />
      <input placeholder="שם נציג" onChange={e => setForm({ ...form, contactName: e.target.value })} />
      <input placeholder="סחורות (מופרד בפסיקים)" onChange={e => setForm({ ...form, products: e.target.value })} />
      <button onClick={handleSubmit}>הירשם</button>
    </div>
  );
}
