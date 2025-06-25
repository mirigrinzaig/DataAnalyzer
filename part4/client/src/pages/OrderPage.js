import { useEffect, useState } from "react";



export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // כאן תוכל לקרוא ל-API שלך ולמשוך את רשימת ההזמנות
    fetch("http://localhost:2025/orders") // עדכן לפי הכתובת והפורט שלך
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>רשימת הזמנות</h2>
      {orders.length === 0 ? (
        <p>לא נמצאו הזמנות</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              הזמנה מ-{order.supplierName} - סטטוס: {order.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
