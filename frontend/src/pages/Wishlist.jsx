import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWishlist,
  removeWishlistItem
} from "../services/api";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getWishlist()
      .then((data) => setWishlist(data))
      .catch(() =>
        setError("Please login first")
      );
  }, []);

  async function removeItem(itemId) {
    try {
      await removeWishlistItem(itemId);

      setWishlist(
        wishlist.filter(
          (item) => item.id !== itemId
        )
      );
    } catch {
      setError("Item remove nahi hua");
    }
  }

  if (error) {
    return (
      <div className="empty-page">
        <div className="empty-icon">♡</div>
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
        <p>YOUR FAVOURITES</p>
        <h1>My Wishlist ♡</h1>
      </div>

      {wishlist.length === 0 ? (

        <div className="empty-page">

          <div className="empty-icon">
            ♡
          </div>

          <h2>Your wishlist is empty</h2>

          <p>
            Save products you love here.
          </p>

          <button
            onClick={() => navigate("/")}
          >
            Explore Products
          </button>

        </div>

      ) : (

        <div className="wishlist-grid">

          {wishlist.map((item) => (

            <div
              className="wishlist-card"
              key={item.id}
            >

              <div
                onClick={() =>
                  navigate(
                    `/products/${item.product_id}`
                  )
                }
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                  />
                ) : (
                  <div className="wishlist-placeholder">
                    🛍️
                  </div>
                )}
              </div>

              <div className="wishlist-info">

                <h3>{item.name}</h3>

                <strong>
                  ₹{item.price}
                </strong>

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

      )}

    </div>
  );
}

export default Wishlist;