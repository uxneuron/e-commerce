import { useEffect, useState } from "react";

import {
  getSellerOrders,
  updateOrderStatus
} from "../services/api";

function SellerOrders() {

  const [orders, setOrders] =
    useState([]);

  const [error, setError] =
    useState("");

  useEffect(() => {

    getSellerOrders()
      .then((data) =>
        setOrders(data)
      )
      .catch(() =>
        setError(
          "Orders load nahi hue"
        )
      );

  }, []);


  async function changeStatus(
    orderId,
    status
  ) {

    try {

      await updateOrderStatus(
        orderId,
        status
      );

      setOrders(
        orders.map((order) =>
          order.order_id === orderId
            ? {
                ...order,
                status
              }
            : order
        )
      );

    } catch {

      setError(
        "Status update nahi hua"
      );
    }
  }


  if (error) {
    return (
      <div className="empty-page">
        <h2>{error}</h2>
      </div>
    );
  }


  return (
    <div className="page">

      <div className="page-title">

        <p>SELLER PANEL</p>

        <h1>Manage Orders</h1>

      </div>


      {orders.length === 0 ? (

        <div className="empty-page">

          <div className="empty-icon">
            📦
          </div>

          <h2>No orders found</h2>

          <p>
            Customer orders will appear here.
          </p>

        </div>

      ) : (

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order.order_id}
            >

              <div className="order-header">

                <div>
                  <p>ORDER</p>
                  <h3>
                    #{order.order_id}
                  </h3>
                </div>

                <span
                  className={`status-badge ${order.status}`}
                >
                  {order.status}
                </span>

              </div>


              <p>
                <b>Address:</b>{" "}
                {order.address}
              </p>


              <h4>Products</h4>

              {order.items.map(
                (item) => (
                  <div
                    className="seller-order-item"
                    key={item.product_id}
                  >
                    <span>
                      {item.product_name}
                      {" × "}
                      {item.quantity}
                    </span>

                    <strong>
                      ₹{item.price}
                    </strong>
                  </div>
                )
              )}


              <div className="seller-order-bottom">

                <strong>
                  Total: ₹
                  {order.total_amount}
                </strong>

                <select
                  value={order.status}
                  onChange={(e) =>
                    changeStatus(
                      order.order_id,
                      e.target.value
                    )
                  }
                >
                  <option value="placed">
                    Placed
                  </option>

                  <option value="shipped">
                    Shipped
                  </option>

                  <option value="delivered">
                    Delivered
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default SellerOrders;