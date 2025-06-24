import { useEffect, useState } from 'react';
import axios from 'axios';

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
    alert("אין התחברות");
    return;
  }
  
  const userData = parseJwt(accessToken);
  if (!userData || !userData.id) {
    alert("טוקן לא תקין");
    return;
  }
  
  const supplierId = userData.id;
    if (!supplierId) {
      alert("אין התחברות");
      return;
    }

    const fetchOrders = async () => {
      try {
        console.log(`http://localhost:2025/api/orders/supplier/${supplierId}`);

        const res = await axios.get(`http://localhost:2025/api/orders/supplier/${supplierId}`);
        setOrders(res.data);
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

//   return (
//     <div>
//       <h2>ההזמנות שלי</h2>
//       {orders.length === 0 ? (
//         <p>אין הזמנות להצגה</p>
//       ) : (
//         <ul>
//           {orders.map((order) => (
//             <li key={order._id}>
//               <p>סטטוס: {order.status}</p>
//               <p>מוצרים:</p>
//               <ul>
//                 {order.products.map((p, i) => (
//                   <li key={i}>{p.productId.productName} - כמות: {p.quantity}</li>
//                 ))}
//               </ul>
//               <hr />
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SupplierDashboard;
return (
    <div>
      <h2>ההזמנות שלי</h2>
      {Array.isArray(orders) && orders.length === 0 ? (
        <p>אין הזמנות להצגה</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <p><b>סטטוס:</b> {order.status}</p>
              <p><b>מוצרים:</b></p>
              <ul>
                {order.products.map((p, i) => (
                  <li key={i}>
                    {p.productId?.productName || "מוצר לא ידוע"} – כמות: {p.quantity}
                  </li>
                ))}
              </ul>

              {order.status === "pending" && (
                <button onClick={() => updateOrderStatus(order._id, "approve")}>
                  אשר הזמנה
                </button>
              )}

              

              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SupplierDashboard;



