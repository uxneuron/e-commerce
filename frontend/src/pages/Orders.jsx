import { useEffect, useState } from "react";
import {
  useNavigate
} from "react-router-dom";
import { getOrders } from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getOrders()
      .then((data) => setOrders(data))
      .catch(() =>
        setError("Please login first")
      );
  }, []);

  if (error) {
    return (
      <div className="empty-page">
        <div className="empty-icon">📦</div>
        <h2>{error}</h2>

        <button
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="page">

      <div className="page-title">
        <p>YOUR PURCHASES</p>
        <h1>My Orders</h1>
      </div>

      {orders.length === 0 ? (

        <div className="empty-page">

          <div className="empty-icon">
            📦
          </div>

          <h2>No orders yet</h2>

          <p>
            Your placed orders will appear here.
          </p>

          <button
            onClick={() => navigate("/")}
          >
            Start Shopping
          </button>

        </div>

      ) : (

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order.id}
            >

              <div className="order-header">

                <div>
                  <p>ORDER ID</p>
                  <h3>#{order.id}</h3>
                </div>

                <span
                  className={`status-badge ${order.status}`}
                >
                  {order.status}
                </span>

              </div>

              <div className="order-info">

                <div>
                  <span>Total Amount</span>
                  <strong>
                    ₹{order.total_amount}
                  </strong>
                </div>

                <div>
                  <span>Delivery Address</span>
                  <strong>
                    {order.address}
                  </strong>
                </div>

              </div>

              <button
                className="details-button"
                onClick={() =>
                  navigate(
                    `/orders/${order.id}`
                  )
                }
              >
                View Details →
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Orders;