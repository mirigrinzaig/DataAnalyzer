import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SupplierRegister from './pages/Auth/SupplierRegister';
import SupplierDashboard from './pages/Supplier/SupplierDashboard';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import NavBar from "./components/NavBar";
import OrderProductsPage from "./pages/Products/OrderProductsPage";
import MannagerDashboard from "./pages/Admin/ManagerDashboard";
import Products from "./pages/Products/Products";
import CheckoutPage from "./pages/Products/CheckoutPage";
import Footer from "./components/Footer";
import './App.css';


const App=()=> {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-supplier" element={<SupplierRegister />} />
        <Route path="/supplier" element={<SupplierDashboard />} />
        <Route path="/admin" element={<MannagerDashboard />} />
        <Route path="/admin/order" element={<OrderProductsPage />} />
        <Route path="/checkout" element={<CheckoutPage/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
