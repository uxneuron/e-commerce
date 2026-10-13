import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getProduct,
  updateProduct
} from "../services/api";

function EditProduct() {

  const { productId } =
    useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState(null);

  const [error, setError] =
    useState("");

  useEffect(() => {

    getProduct(productId)
      .then((data) => {

        setForm({
          name: data.name || "",
          description:
            data.description || "",
          price: data.price || "",
          discount_price:
            data.discount_price || "",
          stock: data.stock || "",
          image_url:
            data.image_url || "",
          category_id:
            data.category_id || ""
        });

      })
      .catch(() =>
        setError(
          "Product load nahi hua"
        )
      );

  }, [productId]);


  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  }


  async function handleSubmit(e) {

    e.preventDefault();

    try {

      await updateProduct(
        productId,
        {
          ...form,
          price: Number(form.price),
          discount_price:
            form.discount_price
              ? Number(form.discount_price)
              : null,
          stock: Number(form.stock),
          category_id: Number(
            form.category_id
          )
        }
      );

      navigate("/seller");

    } catch {

      setError(
        "Product update nahi hua"
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

  if (!form) {
    return (
      <div className="empty-page">
        Loading...
      </div>
    );
  }


  return (
    <div className="form-page">

      <div className="form-card">

        <p className="dashboard-label">
          SELLER PANEL
        </p>

        <h1>Edit Product</h1>

        <form onSubmit={handleSubmit}>

          <label>Product Name</label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />


          <label>Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />


          <div className="form-grid">

            <div>
              <label>Price</label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Discount Price</label>

              <input
                type="number"
                name="discount_price"
                value={form.discount_price}
                onChange={handleChange}
              />
            </div>

          </div>


          <div className="form-grid">

            <div>
              <label>Stock</label>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Category ID</label>

              <input
                type="number"
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
              />
            </div>

          </div>


          <label>Image URL</label>

          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
          />


          {error && (
            <p className="form-error">
              {error}
            </p>
          )}


          <div className="form-actions">

            <button type="submit">
              Save Changes
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate("/seller")
              }
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditProduct;