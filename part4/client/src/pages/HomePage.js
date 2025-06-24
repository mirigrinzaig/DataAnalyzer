// // import "./HomePage.css";

// export default function HomePage() {
//   return (
//     <div style={{ padding: 20 }}>
//       <article class="article">
//         <h2 class="title">המכולת השכונתית </h2><p>כאן תוכלו להתחבר או להרשם, לצפות בהזמנות ולהוסיף הזמנות חדשות.</p>
//       </article>
//       {/* <img src="/grocery-store.png" class="logo" alt=""></img> */}
//     </div>
//   );
// }
// src/pages/HomePage.js
import "./HomePage.css";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:2025/api/products")
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error(err));
    console.log(products);

  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>מערכת ניהול מכולת</h1>
        <p>מערכת חכמה לניהול סחורות, הזמנות וספקים.</p>
        <div className="home-buttons">
          <Link to="/login" className="btn">התחברות</Link>
          <Link to="/register" className="btn">רישום</Link>
        </div>
      </header>

      <footer style={{ marginTop: 40 }}>
        <hr />
        <p><b>צור קשר:</b> טלפון: 03-1234567 | כתובת: רחוב הדוגמה 5, חמלה</p>
      </footer>
    </div>
  );
}
