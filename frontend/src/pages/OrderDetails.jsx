import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrder } from "../services/api";

function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrder(orderId)
      .then((data) => setOrder(data))
      .catch(() => setError("Order details load nahi hue"));
  }, [orderId]);

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!order) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h1>Order Details</h1>

      <div className="order-card">
        <h2>Order #{order.id}</h2>

        <p>
          <b>Status:</b> {order.status}
        </p>

        <p>
          <b>Total:</b> ₹{order.total_amount}
        </p>

        <p>
          <b>Address:</b> {order.address}
        </p>

        <h3>Items</h3>

        {order.items &&
          order.items.map((item) => (
            <div key={item.id}>
              <p>Product ID: {item.product_id}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ₹{item.price}</p>
              <hr />
            </div>
          ))}
      </div>
    </div>
  );
}

export default OrderDetails;