import "./HomePage.css";
import axios from 'axios';
import { Link} from 'react-router-dom';
import { useEffect, useState } from "react";

const HomePage=() => {
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
          <Link to="/register-supplier" className="btn">רישום</Link>
        </div>
      </header>
    </div>
  );
}
export default HomePage;
