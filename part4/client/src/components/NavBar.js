import { Link, useNavigate } from "react-router-dom";
import './NavBar.css';


const NavBar=()=>{

  const parseJwt = (token) => {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
      console.log(payload);
    } catch (e) {
      return null;
    }
  };

  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const token = user?.accessToken;
  const decoded = token ? parseJwt(token) : null;

  const userRole = decoded?.role;

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
        <Link to="/checkout" className="link">קופה</Link>


      </div>
      <div className="navbar-left">
        {isLoggedIn && (
          <Link
            to={userRole === "Supplier" ? "/supplier" : "/admin"}
            className="link"
          > הזמנות
          </Link>
        )}
        {isLoggedIn ? (
          <button className="link" onClick={handleLogout}>התנתק</button>
        ) : (
          <>
            <Link to="/login" className="link">התחברות</Link>
            <Link to="/register-supplier" className="link">רישום</Link>
          </>
        )}
      </div>

    </nav>
  );
}
export default NavBar;
