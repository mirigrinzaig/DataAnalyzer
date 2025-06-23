import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SupplierDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const supplierId = localStorage.getItem('supplierId');
    if (!supplierId) {
      alert("אין התחברות");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:2025/api/orders/supplier/${supplierId}`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>ההזמנות שלי</h2>
      {orders.length === 0 ? (
        <p>אין הזמנות להצגה</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <p>סטטוס: {order.status}</p>
              <p>מוצרים:</p>
              <ul>
                {order.products.map((p, i) => (
                  <li key={i}>{p.productId.productName} - כמות: {p.quantity}</li>
                ))}
              </ul>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SupplierDashboard;
