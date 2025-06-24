import { Link, useNavigate } from "react-router-dom";
import './NavBar.css';


export default function NavBar() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const isLoggedIn = !!localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-right">
        <img src="/grocery-clipart.png" alt="לוגו" className="logo" />
        <Link to="/" className="link">
          בית  
        </Link>
        <Link to="/products" className="link">מוצרים</Link>
       

      </div>
      <div className="navbar-left">
         {isLoggedIn && <Link to="/admin" className="link">הזמנות</Link>}
        {isLoggedIn ? (
          <button  className="link" onClick={handleLogout}>התנתק</button>
        ) : (
          <>
            <Link to="/login" className="link">התחברות</Link>
            <Link to="/register-supplier" className="link">רישום</Link>
          </>
        )}
        {/* {!user && (
            <Link to="/login" style={{ color: "white", marginRight: 10 }}>התחברות</Link>
          )} */}
        {/* {!user && (
            <Link to="/register-supplier" style={{ color: "white", marginRight: 10 }}>רישום ספק</Link>
          )} */}
        {/* {user && (
            <><p>{user.role}</p>
              <button onClick={handleLogout} style={{ background: "transparent", color: "white", border: "none", cursor: "pointer" }}>
                התנתקות
              </button></>
          )} */}
      </div>

    </nav>
  );
}
