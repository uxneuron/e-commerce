import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import {
  getProducts,
  getCategories
} from "../services/api";

function Home({ search }) {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

  useEffect(() => {

    setLoading(true);

    getProducts(
      search,
      categoryId,
      minPrice,
      maxPrice
    )
      .then((data) => {
        setProducts(data.products);
        setError("");
      })
      .catch(() => {
        setError("Products load nahi hue");
      })
      .finally(() => {
        setLoading(false);
      });

  }, [search, categoryId, minPrice, maxPrice]);

  return (
    <div>

      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-small">
            TRENDING COLLECTION
          </p>

          <h1>
            Shop Everything
            <br />
            You Love ❤️
          </h1>

          <p>
            Fashion, beauty, electronics and
            more at amazing prices.
          </p>

          <button
            onClick={() =>
              window.scrollTo({
                top: 500,
                behavior: "smooth"
              })
            }
          >
            Shop Now
          </button>

        </div>

        <div className="hero-decoration">
          🛍️
        </div>

      </section>


      {/* FILTERS */}

      <div className="filters">

        <select
          value={categoryId}
          onChange={(e) =>
            setCategoryId(e.target.value)
          }
        >
          <option value="">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) =>
            setMinPrice(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(e.target.value)
          }
        />

        <button
          onClick={() => {
            setCategoryId("");
            setMinPrice("");
            setMaxPrice("");
          }}
        >
          Clear Filters
        </button>

      </div>


      {/* PRODUCTS */}

      <section className="shop-section">

        <div className="section-heading">

          <div>
            <p>OUR COLLECTION</p>
            <h2>
              {search
                ? `Search results for "${search}"`
                : "Explore Products"}
            </h2>
          </div>

          <span>
            {products.length} products
          </span>

        </div>


        {loading && (
          <div className="status-message">
            Loading products...
          </div>
        )}

        {error && (
          <div className="status-message error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="empty-state">
              <div>🛍️</div>
              <h2>No products found</h2>
              <p>
                Try changing your search or filters.
              </p>
            </div>
          )}


        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="products">

              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>
          )}

      </section>

    </div>
  );
}

export default Home;