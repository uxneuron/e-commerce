import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/api";

function Checkout() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleOrder(e) {
    e.preventDefault();

    if (!address.trim()) {
      setError("Please enter your delivery address");
      return;
    }

    try {
      setLoading(true);
      await createOrder(address);
      navigate("/orders");
    } catch {
      setError("Order place nahi hua");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout-page">

      <div className="checkout-card">

        <div className="checkout-heading">
          <p>CHECKOUT</p>
          <h1>Delivery Details</h1>
          <span>
            Enter your address to place the order.
          </span>
        </div>

        <form onSubmit={handleOrder}>

          <label>Delivery Address</label>

          <textarea
            placeholder="House no., street, city, state, PIN code"
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
            required
          />

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Placing Order..."
              : "Place Order"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Checkout;