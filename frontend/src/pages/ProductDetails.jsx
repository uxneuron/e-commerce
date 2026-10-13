import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getProduct,
  addToCart,
  addToWishlist
} from "../services/api";

function ProductDetails() {

  const { productId } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  useEffect(() => {

    getProduct(productId)
      .then((data) => setProduct(data))
      .catch(() =>
        setMessage(
          "Product load nahi hua"
        )
      );

  }, [productId]);

  if (!product) {
    return (
      <div className="empty-page">
        Loading...
      </div>
    );
  }

  const finalPrice =
    product.discount_price ??
    product.price;

  async function handleCart() {
    try {

      await addToCart(
        product.id,
        quantity
      );

      setMessage(
        "✓ Added to cart"
      );

    } catch {
      setMessage(
        "Please login first"
      );
    }
  }

  async function handleWishlist() {
    try {

      await addToWishlist(
        product.id
      );

      setMessage(
        "♡ Added to wishlist"
      );

    } catch {
      setMessage(
        "Already in wishlist or login required"
      );
    }
  }

  return (
    <div className="details-page">

      <div className="details-image">

        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
          />
        ) : (
          <div className="details-placeholder">
            🛍️
          </div>
        )}

      </div>


      <div className="details-info">

        <p className="product-label">
          PRODUCT DETAILS
        </p>

        <h1>{product.name}</h1>

        <div className="details-price">

          <strong>
            ₹{finalPrice}
          </strong>

          {product.discount_price && (
            <span>
              ₹{product.price}
            </span>
          )}

        </div>

        {product.discount_price && (
          <div className="discount">
            {Math.round(
              ((product.price -
                product.discount_price) /
                product.price) *
                100
            )}
            % OFF
          </div>
        )}

        <p className="description">
          {product.description}
        </p>

        <p className="stock">
          {product.stock > 0
            ? `✓ ${product.stock} items available`
            : "Out of Stock"}
        </p>


        {product.stock > 0 && (

          <div className="quantity-box large">

            <button
              disabled={quantity === 1}
              onClick={() =>
                setQuantity(quantity - 1)
              }
            >
              −
            </button>

            <span>{quantity}</span>

            <button
              disabled={
                quantity >= product.stock
              }
              onClick={() =>
                setQuantity(quantity + 1)
              }
            >
              +
            </button>

          </div>

        )}


        <div className="details-actions">

          <button
            disabled={product.stock === 0}
            onClick={handleCart}
          >
            🛒 Add to Cart
          </button>

          <button
            className="secondary-button"
            onClick={handleWishlist}
          >
            ♡ Wishlist
          </button>

        </div>


        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

      </div>

    </div>
  );
}

export default ProductDetails;