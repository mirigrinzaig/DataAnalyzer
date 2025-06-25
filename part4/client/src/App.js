import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SupplierRegister from './pages/SupplierRegister';
// import SupplierLogin from './pages/SupplierLogin';
import SupplierDashboard from './pages/SupplierDashboard';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrderPage';
// import AddProductPage from "./pages/AddProductPage";
import NavBar from "./components/NavBar";
import OrderProductsPage from "./pages/OrderProductsPage";
import MannagerDashboard from "./pages/ManagerDashboard";
import Products from "./pages/Products";
import CheckoutPage from "./pages/CheckoutPage";
import './App.css';


function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-supplier" element={<SupplierRegister />} />
        {/* <Route path="/login-supplier" element={<SupplierLogin />} /> */}
        <Route path="/supplier" element={<SupplierDashboard />} />
        {/* <Route path="/supplier/add-products" element={<AddProductPage />} /> */}
        <Route path="/admin" element={<MannagerDashboard />} />
        <Route path="/admin/order" element={<OrderProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/checkout" element={<CheckoutPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
