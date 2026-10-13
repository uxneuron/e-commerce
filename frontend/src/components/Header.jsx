import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header({ onSearch }) {

  const navigate = useNavigate();

  const [searchText, setSearchText] =
    useState("");

  function handleSearch(e) {
    e.preventDefault();
    onSearch(searchText);
    navigate("/");
  }

  return (
    <header className="header">

      <div
        className="logo"
        onClick={() => navigate("/")}
      >
        <span>meesho</span>
      </div>


      <form
        className="search-box"
        onSubmit={handleSearch}
      >

        <span className="search-icon">
          🔍
        </span>

        <input
          type="text"
          placeholder="Search for products, brands and more"
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
          }
        />

      </form>


      <div className="header-actions">

        <button
          onClick={() => navigate("/wishlist")}
        >
          ♡
          <span>Wishlist</span>
        </button>

        <button
          onClick={() => navigate("/cart")}
        >
          🛒
          <span>Cart</span>
        </button>

        <button
          onClick={() => navigate("/orders")}
        >
          📦
          <span>Orders</span>
        </button>

        <button
          onClick={() => navigate("/login")}
        >
          👤
          <span>Login</span>
        </button>

      </div>

    </header>
  );
}

export default Header;