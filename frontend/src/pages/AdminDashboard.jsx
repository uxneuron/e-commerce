import { useEffect, useState } from "react";

import {
  getAdminUsers,
  deleteAdminUser,
  getAdminProducts,
  deleteAdminProduct,
  getAdminOrders
} from "../services/api";

function AdminDashboard() {

  const [users, setUsers] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    try {

      const [
        usersData,
        productsData,
        ordersData
      ] = await Promise.all([
        getAdminUsers(),
        getAdminProducts(),
        getAdminOrders()
      ]);

      setUsers(usersData);
      setProducts(productsData);
      setOrders(ordersData);

    } catch {

      setError(
        "Admin data load nahi hua"
      );
    }
  }


  async function handleDeleteUser(
    userId
  ) {

    try {

      await deleteAdminUser(
        userId
      );

      setUsers(
        users.filter(
          (user) => user.id !== userId
        )
      );

    } catch {

      setError(
        "User delete nahi hua"
      );
    }
  }


  async function handleDeleteProduct(
    productId
  ) {

    try {

      await deleteAdminProduct(
        productId
      );

      setProducts(
        products.filter(
          (product) =>
            product.id !== productId
        )
      );

    } catch {

      setError(
        "Product delete nahi hua"
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

      <div className="dashboard-header">

        <div>

          <p className="dashboard-label">
            ADMIN PANEL
          </p>

          <h1>Admin Dashboard</h1>

          <p>
            Manage users, products and orders.
          </p>

        </div>

      </div>


      <div className="admin-stats">

        <div>
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>

        <div>
          <span>Total Products</span>
          <strong>{products.length}</strong>
        </div>

        <div>
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>

      </div>


      <section className="admin-section">

        <h2>Users</h2>

        <div className="admin-list">

          {users.map((user) => (

            <div
              className="admin-row"
              key={user.id}
            >

              <div>
                <strong>
                  {user.name}
                </strong>

                <span>
                  {user.email}
                </span>
              </div>

              <span className="role-badge">
                {user.role}
              </span>

              <button
                className="danger-button"
                onClick={() =>
                  handleDeleteUser(
                    user.id
                  )
                }
              >
                Delete
              </button>

            </div>

          ))}

        </div>

      </section>


      <section className="admin-section">

        <h2>Products</h2>

        <div className="admin-products">

          {products.map((product) => (

            <div
              className="admin-product"
              key={product.id}
            >

              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                />
              ) : (
                <div className="seller-placeholder">
                  🛍️
                </div>
              )}

              <div>

                <strong>
                  {product.name}
                </strong>

                <p>
                  ₹{product.price}
                </p>

                <button
                  className="danger-button"
                  onClick={() =>
                    handleDeleteProduct(
                      product.id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>


      <section className="admin-section">

        <h2>Orders</h2>

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order.id}
            >

              <div className="order-header">

                <h3>
                  Order #{order.id}
                </h3>

                <span className="status-badge">
                  {order.status}
                </span>

              </div>

              <p>
                User ID: {order.user_id}
              </p>

              <p>
                Total: ₹
                {order.total_amount}
              </p>

              <p>
                Address: {order.address}
              </p>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default AdminDashboard;