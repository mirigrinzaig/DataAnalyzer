import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Orders.css';

const ManagerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("http://localhost:2025/api/orders");
                const ordersData = Array.isArray(res.data.data) ? res.data.data : [];
                ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(ordersData);
            } catch (err) {
                console.error("שגיאה בשליפת הזמנות:", err);
            }
        };

        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId, action) => {
        try {
            await axios.put(`http://localhost:2025/api/orders/${orderId}/${action}`);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId
                        ? {
                            ...order,
                            status: action === "approve" ? "inProgress" : "completed"
                        }
                        : order
                )
            );
        } catch (err) {
            console.error("שגיאה בעדכון סטטוס ההזמנה:", err);
            alert("שגיאה בעדכון סטטוס");
        }
    };


    return (
        <div className='manager-dashboard'>
            <h2>ממשק ניהול - בעל מכולת</h2>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <button className="action-btn" onClick={() => navigate("/admin/order")}>
                    הזמנת סחורה חדשה
                </button>
            </div>
            <div className='orders-container'>
                <h2>רשימת ההזמנות</h2>

                {orders.length === 0 ? (
                    <p>אין הזמנות להצגה.</p>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className='order-card'>
                            <h4>מספר הזמנה: {order._id.slice(-5)}</h4>
                            <p><b>חברה:</b> {order.supplierId?.companyName}</p>
                            <div className={`status ${order.status}`}>{order.status}</div>
                            <p><b>מוצרים:</b></p>
                            <ul className='order-products'>
                                {order.products.map((prod, idx) => (
                                    <li key={idx}>
                                        {prod.productId.productName} – כמות: {prod.quantity}
                                    </li>
                                ))}
                            </ul>
                            {order.status === "inProgress" && (
                                <button className='action-btn' onClick={() => updateOrderStatus(order._id, "complete")}>
                                    סמן כהושלמה
                                </button>
                            )}
                        </div>
                    ))
                )}</div>
        </div>
    );
}
export default ManagerDashboard
