import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("http://localhost:2025/api/orders");
                const ordersData = Array.isArray(res.data.data) ? res.data.data : [];
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
        <div style={{ padding: 20 }}>
            <h2>לוח ניהול - בעל מכולת</h2>
            <button onClick={() => navigate("/admin/order")} style={{ marginBottom: 20 }}>
                הזמנת סחורה חדשה
            </button>

            {orders.length === 0 ? (
                <p>אין הזמנות להצגה.</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id} style={{
                        border: "1px solid gray",
                        padding: 10,
                        marginBottom: 10,
                        borderRadius: 8
                    }}>
                        <p><b>ספק:</b> {order.supplierId?.companyName}</p>
                        <p><b>סטטוס:</b> {order.status}</p>
                        <p><b>מוצרים:</b></p>
                        <ul>
                            {order.products.map((prod, idx) => (
                                <li key={idx}>
                                    {prod.productId.productName} – כמות: {prod.quantity}
                                </li>
                            ))}
                        </ul>
                        {order.status === "inProgress" && (
                            <button onClick={() => updateOrderStatus(order._id, "complete")}>
                                סמן כהושלמה
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
export default ManagerDashboard
