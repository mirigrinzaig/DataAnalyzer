import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

const LoginPage=() => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:2025/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phoneNumber, password})
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        alert(`התחברת בהצלחה כ-${data.role === "Owner" ? "מנהל" : "ספק"}`);
        if (data.role === "Owner") {
          navigate("/admin");
        } else {
          navigate("/supplier");
        }
      } else {
        alert(data.message || "שגיאה בהתחברות");
        
      }
    } catch (err) {
      console.error(err);
      alert("שגיאה בחיבור לשרת");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">התחברות</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="פלאפון"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">התחבר</button>
      </form>
    </div>
  );
}

export default LoginPage;
