import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateCartItem,
  removeCartItem
} from "../services/api";

function Cart() {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getCart()
      .then((data) => setCart(data))
      .catch(() => setError("Please login first"));
  }, []);

  async function changeQuantity(itemId, quantity) {
    try {
      await updateCartItem(itemId, quantity);

      const updatedCart = await getCart();
      setCart(updatedCart);
    } catch {
      setError("Quantity update nahi hui");
    }
  }

  async function removeItem(itemId) {
    try {
      await removeCartItem(itemId);

      setCart(
        cart.filter((item) => item.id !== itemId)
      );
    } catch {
      setError("Item remove nahi hua");
    }
  }

  if (error) {
    return (
      <div className="empty-page">
        <div className="empty-icon">🛒</div>
        <h2>{error}</h2>
        <button onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  return (
    <div className="page">

      <div className="page-title">
        <p>SHOPPING BAG</p>
        <h1>My Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="empty-page">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add something you love to your cart.</p>

          <button onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (

        <div className="cart-layout">

          <div className="cart-list">

            {cart.map((item) => (

              <div className="cart-item" key={item.id}>

                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                  />
                ) : (
                  <div className="cart-image-placeholder">
                    🛍️
                  </div>
                )}

                <div className="cart-details">

                  <h3>{item.name}</h3>

                  <p className="cart-price">
                    ₹{item.price}
                  </p>

                  <div className="quantity-box">

                    <button
                      disabled={item.quantity === 1}
                      onClick={() =>
                        changeQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        changeQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <p className="subtotal">
                    Subtotal: ₹{item.subtotal}
                  </p>

                  <button
                    className="remove-button"
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>


          <div className="cart-summary">

            <h2>Price Details</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span className="free">
                FREE
              </span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total Amount</span>
              <strong>₹{total}</strong>
            </div>

            <button
              className="checkout-button"
              onClick={() =>
                navigate("/checkout")
              }
            >
              Proceed to Checkout
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Cart;