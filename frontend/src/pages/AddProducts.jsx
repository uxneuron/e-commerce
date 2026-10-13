import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../services/api";

function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await addProduct({
        name,
        description,
        price: Number(price),
        discount_price: discountPrice
          ? Number(discountPrice)
          : null,
        stock: Number(stock),
        image_url: imageUrl || null,
        category_id: Number(categoryId),
      });

      navigate("/seller");
    } catch (error) {
      setError("Product add nahi hua");
    }
  }

  return (
    <div>
      <h1>Add Product</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Discount Price"
          value={discountPrice}
          onChange={(e) => setDiscountPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <input
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <input
          type="number"
          placeholder="Category ID"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        />

        <button type="submit">
          Add Product
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}

export default AddProduct;