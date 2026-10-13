import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getSellerProducts,
  deleteProduct
} from "../services/api";

function SellerDashboard() {

  const [products, setProducts] =
    useState([]);

  const [error, setError] =
    useState("");

  const navigate = useNavigate();

  useEffect(() => {

    getSellerProducts()
      .then((data) =>
        setProducts(data)
      )
      .catch(() =>
        setError(
          "Seller products load nahi hue"
        )
      );

  }, []);

  async function handleDelete(productId) {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) return;

    try {

      await deleteProduct(productId);

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
            SELLER PANEL
          </p>

          <h1>Seller Dashboard</h1>

          <p>
            Manage your products and orders.
          </p>
        </div>

        <div className="dashboard-actions">

          <button
            onClick={() =>
              navigate(
                "/seller/add-product"
              )
            }
          >
            + Add Product
          </button>

          <button
            className="secondary-button"
            onClick={() =>
              navigate(
                "/seller/orders"
              )
            }
          >
            View Orders
          </button>

        </div>

      </div>


      <div className="seller-stats">

        <div>
          <span>Total Products</span>
          <strong>{products.length}</strong>
        </div>

        <div>
          <span>Seller Account</span>
          <strong>Active</strong>
        </div>

      </div>


      <h2 className="dashboard-section-title">
        Your Products
      </h2>


      {products.length === 0 ? (

        <div className="empty-page">
          <div className="empty-icon">
            📦
          </div>

          <h2>No products yet</h2>

          <p>
            Add your first product to start selling.
          </p>

          <button
            onClick={() =>
              navigate(
                "/seller/add-product"
              )
            }
          >
            Add Product
          </button>
        </div>

      ) : (

        <div className="seller-products">

          {products.map((product) => (

            <div
              className="seller-product-card"
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

              <div className="seller-product-info">

                <h3>{product.name}</h3>

                <strong>
                  ₹{product.price}
                </strong>

                <p>
                  Stock: {product.stock}
                </p>

                <div className="seller-card-actions">

                  <button
                    onClick={() =>
                      navigate(
                        `/seller/edit/${product.id}`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="danger-button"
                    onClick={() =>
                      handleDelete(product.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default SellerDashboard;