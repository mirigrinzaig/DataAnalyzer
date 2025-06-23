import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/suppliers/login', { phone });
      if (res.data.success) {
        navigate('/supplier');
      } else {
        alert('לא נמצא ספק');
      }
    } catch (err) {
      alert('שגיאה בכניסה');
    }
  };

  return (
    <div>
      <h2>כניסת ספק</h2>
      <input placeholder="מספר טלפון" value={phone} onChange={e => setPhone(e.target.value)} />
      <button onClick={handleLogin}>כניסה</button>
      <p>אין לך משתמש? <a href="/register">הרשמה</a></p>
    </div>
  );
}
