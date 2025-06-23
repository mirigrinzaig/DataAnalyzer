import { useState } from "react";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // "manager" או "supplier"

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!role) {
      alert("בחר סוג משתמש: מנהל או ספק");
      return;
    }

    try {
      const res = await fetch("http://localhost:2025/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phoneNumber, password, role })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`התחברת בהצלחה כ-${role === "Owner" ? "מנהל" : "ספק"}`);
        // כאן ניתן לשמור טוקן / לעבור לעמוד מתאים
      } else {
        alert(data.message || "שגיאה בהתחברות");
      }
    } catch (err) {
      console.error(err);
      alert("שגיאה בחיבור לשרת");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>התחברות</h2>
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
          style={{ display: "block", marginBottom: 10 }}
        />

        <div style={{ marginBottom: 10 }}>
          <button type="button" onClick={() => setRole("Owner")}>כניסת מנהל</button>
          <button type="button" onClick={() => setRole("Supplier")} style={{ marginLeft: 10 }}>
            כניסת ספק
          </button>
        </div>

        <button type="submit">התחבר</button>
      </form>
    </div>
  );
}
