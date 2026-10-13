import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  return (
    <nav className="navbar">

      <span onClick={() => navigate("/")}>
        Home
      </span>

      <span onClick={() => navigate("/wishlist")}>
        Wishlist
      </span>

      <span onClick={() => navigate("/cart")}>
        Cart
      </span>

      <span onClick={() => navigate("/orders")}>
        My Orders
      </span>

      <span
        onClick={() =>
          navigate("/seller")
        }
      >
        Seller
      </span>

      <span
        onClick={() =>
          navigate("/admin")
        }
      >
        Admin
      </span>

    </nav>
  );
}

export default Navbar;