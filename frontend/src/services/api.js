const API_URL = "http://127.0.0.1:8000";

export async function getProducts(
  search = "",
  categoryId = "",
  minPrice = "",
  maxPrice = ""
) {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  if (categoryId) {
    params.append("category_id", categoryId);
  }

  if (minPrice) {
    params.append("min_price", minPrice);
  }

  if (maxPrice) {
    params.append("max_price", maxPrice);
  }

  const response = await fetch(
    `${API_URL}/products?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getCategories(){
  const response = await fetch(`${API_URL}/categories`);
  if(!response.ok){
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}
export async function getProduct(productId) {
  const response = await fetch(
    `${API_URL}/products/${productId}`
  );

  if (!response.ok) {
    throw new Error("Product not found");
  }

  return response.json();
}
export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  return response.json();
}

export async function addToCart(productId, quantity = 1) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/cart/add`, {
    method: "POST",    
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_id: productId,
      quantity: quantity,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add product to cart");
  }

  return response.json();
}

export async function getCart() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }

  return response.json();
}
export async function updateCartItem(itemId, quantity) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/cart/${itemId}?quantity=${quantity}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update cart");
  }

  return response.json();
}

export async function removeCartItem(itemId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/cart/${itemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove item");
  }

  return response.json();
}

export async function createOrder(address) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      address: address,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  return response.json();
}
export async function getOrders() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
}

export async function registerUser(name, email, password, role = "customer") {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      role,
    }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
}
export async function getSellerProducts() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/seller/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch seller products");
  }

  return response.json();
}
export async function addProduct(product) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to add product");
  }

  return response.json();
}

export async function updateProduct(productId, product) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/products/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return response.json();
}

export async function deleteProduct(productId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }

  return response.json();
}  
export async function addToWishlist(productId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_id: productId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add wishlist");
  }

  return response.json();
}

export async function getWishlist() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/wishlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch wishlist");
  }

  return response.json();
}

export async function removeWishlistItem(itemId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/wishlist/${itemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove wishlist item");
  }

  return response.json();
} 

export async function getSellerOrders() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/seller/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch seller orders");
  }

  return response.json();
}


export async function updateOrderStatus(orderId, status) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/seller/orders/${orderId}/status?status=${status}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update order status");
  }

  return response.json();
}
export async function getOrder(orderId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }

  return response.json();
}
export async function getAdminUsers() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}


export async function deleteAdminUser(userId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return response.json();
}


export async function getAdminProducts() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/admin/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}


export async function deleteAdminProduct(productId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/admin/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }

  return response.json();
}


export async function getAdminOrders() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/admin/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
}