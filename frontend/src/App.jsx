import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/checkout";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import SellerDashboard from "./pages/SellerDashboard";
import AddProduct from "./pages/AddProducts";
import EditProduct from "./pages/EditProduct"; 
import Wishlist from "./pages/Wishlist";
import SellerOrders from "./pages/SellerOrders";
import OrderDetails from "./pages/OrderDetails";
import AdminDashboard from "./pages/AdminDashboard";
function App() {
  const [search, setSearch] = useState("");

  return (
    <BrowserRouter>
      <Header onSearch={setSearch} />
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home search={search} />}
        />

        <Route
          path="/products/:productId"
          element={<ProductDetails />}
        />
        <Route
           path="/login"
           element={<Login />}
        />
        <Route
           path="/cart"
           element={<Cart />}
         />
         <Route
         path="/checkout"
         element={<Checkout/>}
         />
         <Route
         path="/orders"
         element={<Orders />}
         />
         <Route
         path="/register"
         element={<Register/>}
         />
          <Route
         path="/seller"
         element={<SellerDashboard/>}
         />
         <Route
          path="/seller/add-product"
          element={<AddProduct />}
          />
          <Route
          path="/seller/edit/:productId"
          element={<EditProduct/>}
          />
          <Route
          path="/seller/orders"
          element={<SellerOrders />}
          />
           <Route
          path="/wishlist"
          element={<Wishlist />}
          />
          <Route
          path="/orders/:orderId"
          element={<OrderDetails />}
          />
          <Route
          path="/admin"
          element={<AdminDashboard />}
          />
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;