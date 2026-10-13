import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const finalPrice =
    product.discount_price ?? product.price;

  return (
    <div className="product-card">

      <div
        className="product-image"
        onClick={() =>
          navigate(`/products/${product.id}`)
        }
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
          />
        ) : (
          <div className="no-image">
            No Image
          </div>
        )}
      </div>

      <div className="product-info">

        <h3>{product.name}</h3>

        <div className="price-row">
          <span className="current-price">
            ₹{finalPrice}
          </span>

          {product.discount_price && (
            <span className="old-price">
              ₹{product.price}
            </span>
          )}
        </div>

        {product.discount_price && (
          <span className="discount">
            {Math.round(
              ((product.price - product.discount_price) /
                product.price) *
                100
            )}
            % OFF
          </span>
        )}

        <p className="stock">
          {product.stock > 0
            ? "✓ In Stock"
            : "Out of Stock"}
        </p>

        <button
          className="view-button"
          onClick={() =>
            navigate(`/products/${product.id}`)
          }
        >
          View Product
        </button>

      </div>
    </div>
  );
}

export default ProductCard;