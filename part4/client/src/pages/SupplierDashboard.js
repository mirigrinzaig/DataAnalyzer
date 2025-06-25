import { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css';

const SupplierDashboard = () => {
  const [orders, setOrders] = useState([]);

  const parseJwt = (token) => {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    const accessToken = user ? JSON.parse(user).accessToken : null;
  if (!accessToken) {
    console.log("אין התחברות");
    return;
  }
  
  const userData = parseJwt(accessToken);
  if (!userData || !userData.id) {
    console.log("טוקן לא תקין");
    return;
  }
  
  const supplierId = userData.id;
    if (!supplierId) {
      console.log("אין התחברות");
      return;
    }

    const fetchOrders = async () => {
      try {
        console.log(`http://localhost:2025/api/orders/supplier/${supplierId}`);

        const res = await axios.get(`http://localhost:2025/api/orders/supplier/${supplierId}`);
        const sorted = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

   const updateOrderStatus = async (orderId, action) => {
    try {
      const url = `http://localhost:2025/api/orders/${orderId}/${action}`;
      await axios.put(url);
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
      console.error(`שגיאה בעדכון סטטוס להזמנה ${orderId}:`, err);
      alert("שגיאה בעדכון הסטטוס");
    }
  };

return (
    <div className='orders-container' style={{ paddingTop: '100px' ,marginTop:"0"}  }>
      <h2 >ההזמנות שלי</h2>
      {Array.isArray(orders) && orders.length === 0 ? (
        <p style={{marginTop:"20vh"}}>אין הזמנות להצגה</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <div key={order._id} className='order-card'>
              <p><b>סטטוס:</b> {order.status}</p>
              <p><b>מוצרים:</b></p>
              <ul className='order-products'>
                {order.products.map((p, i) => (
                  <li key={i}>
                    {p.productId?.productName || "מוצר לא ידוע"} – כמות: {p.quantity}
                  </li>
                ))}
              </ul>

              {order.status === "pending" && (
                <button  className="action-btn" onClick={() => updateOrderStatus(order._id, "approve")}>
                  אשר הזמנה
                </button>
              )}

              

              <hr />
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SupplierDashboard;



