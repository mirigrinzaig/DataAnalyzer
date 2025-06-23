import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SupplierRegister from './pages/SupplierRegister';
import SupplierLogin from './pages/SupplierLogin';
import SupplierDashboard from './pages/SupplierDashboard';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrderPage';

function App() {
  return (
    <Router>
       <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: 10 }}>בית</Link>
        <Link to="/login" style={{ marginRight: 10 }}>התחברות / רישום</Link>
        <Link to="/orders">הזמנות</Link>
      </nav>
      <Routes>
        <Route path="/register-supplier" element={<SupplierRegister />} />
        <Route path="/login-supplier" element={<SupplierLogin />} />
        <Route path="/supplier" element={<SupplierDashboard />} />
         <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
