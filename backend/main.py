from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, get_db
from models import User,Category,Product,Cart,CartItem,Order,OrderItem,Wishlist
from schemas import UserRegister, UserLogin,CategoryCreate ,ProductCreate,ProductUpdate,CartItemCreate,OrderCreate,WishlistCreate
from auth import hash_password, verify_password, create_token,seller_required,get_current_user



Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Meesho Clone API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Meesho Clone API is running!"}


@app.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }


@app.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_token(db_user.id)

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "role": db_user.role
    }

@app.post("/categories")
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db)
):
    new_category = Category(
        name=category.name
    )

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category

@app.get("/categories")
def get_categories(
    db: Session = Depends(get_db)
):
    return db.query(Category).all()


@app.post("/products")
def create_product(
    product: ProductCreate,
    current_user:User=Depends(seller_required),
    db: Session = Depends(get_db)
):
    category=db.query(Category).filter(
        Category.id==product.category_id
    ).first() 

    if not category:
        raise HTTPException(
            status_code=404, 
            detail='Category not found'
        )

    new_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        discount_price=product.discount_price,
        stock=product.stock,
        image_url=product.image_url,
        category_id=product.category_id,
        seller_id=current_user.id
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {
        'message':"Product added successfully", 
        'product':new_product
    }

@app.get("/products")
def get_products(
    search: str | None = None,
    category_id: int | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(
        Product.is_active == True
    )

    if search:
        query = query.filter(
            Product.name.ilike(f"%{search}%")
        )

    if category_id:
        query = query.filter(
            Product.category_id == category_id
        )

    if min_price is not None:
        query = query.filter(
            Product.price >= min_price
        )

    if max_price is not None:
        query = query.filter(
            Product.price <= max_price
        )

    total = query.count()

    products = query.offset(
        (page - 1) * limit
    ).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "products": products
    }
@app.get("/products/{product_id}")
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product
@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    product: ProductUpdate,
    current_user: User = Depends(seller_required),
    db: Session = Depends(get_db)
):
    existing_product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not existing_product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if existing_product.seller_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can update only your own products"
        )

    update_data = product.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(existing_product, key, value)

    db.commit()
    db.refresh(existing_product)

    return existing_product

@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    current_user: User = Depends(seller_required),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if product.seller_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can delete only your own products"
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }

@app.get("/seller/products")
def seller_products(
    current_user: User = Depends(seller_required),
    db: Session = Depends(get_db)
):
    products = db.query(Product).filter(
        Product.seller_id == current_user.id
    ).all()

    return products

@app.post("/cart/add")
def add_to_cart(
    item: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == item.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    cart_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == item.product_id
    ).first()

    if cart_item:
        cart_item.quantity += item.quantity
    else:
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        db.add(cart_item)

    db.commit()

    return {
        "message": "Product added to cart"
    }

@app.get("/cart")
def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        return []

    cart_items = db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).all()

    result = []

    for item in cart_items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if product:
            price = (
                product.discount_price
                if product.discount_price is not None
                else product.price
            )

            result.append({
                "id": item.id,
                "product_id": product.id,
                "name": product.name,
                "price": price,
                "image_url": product.image_url,
                "quantity": item.quantity,
                "subtotal": price * item.quantity
            })

    return result
@app.delete("/cart/{item_id}")
def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Cart not found"
        )

    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Item removed from cart"
    }
@app.put("/cart/{item_id}")
def update_cart_item(
    item_id: int,
    quantity: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Cart not found"
        )

    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not cart_item:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    if quantity < 1:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be at least 1"
        )

    cart_item.quantity = quantity

    db.commit()

    return {
        "message": "Cart quantity updated"
    }    
@app.post("/orders")
def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty"
        )

    cart_items = db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).all()

    if not cart_items:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty"
        )

    total = 0

    for item in cart_items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for {product.name}"
            )

        price = (
            product.discount_price
            if product.discount_price is not None
            else product.price
        )

        total += price * item.quantity

    new_order = Order(
        user_id=current_user.id,
        total_amount=total,
        address=order_data.address
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for item in cart_items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        price = (
            product.discount_price
            if product.discount_price is not None
            else product.price
        )

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=price
        )

        product.stock -= item.quantity

        db.add(order_item)

    db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).delete()

    db.commit()

    return {
        "message": "Order placed successfully",
        "order_id": new_order.id,
        "total_amount": total,
        "status": new_order.status
    }
@app.get("/orders")
def get_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Order).filter(
        Order.user_id == current_user.id
    ).all()

@app.get("/orders/{order_id}")
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order 

@app.post("/wishlist")
def add_to_wishlist(
    item: WishlistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == item.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    existing = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.product_id == item.product_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Product already in wishlist"
        )

    wishlist = Wishlist(
        user_id=current_user.id,
        product_id=item.product_id
    )

    db.add(wishlist)
    db.commit()

    return {
        "message": "Product added to wishlist"
    } 

@app.get("/wishlist")
def get_wishlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id
    ).all()

    result = []

    for item in items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if product:
            result.append({
                "id": item.id,
                "product_id": product.id,
                "name": product.name,
                "price": (
                    product.discount_price
                    if product.discount_price is not None
                    else product.price
                ),
                "image_url": product.image_url
            })

    return result 

@app.delete("/wishlist/{item_id}")
def remove_from_wishlist(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Wishlist).filter(
        Wishlist.id == item_id,
        Wishlist.user_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Wishlist item not found"
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Removed from wishlist"
    }  

@app.get("/seller/orders")
def get_seller_orders(
    current_user: User = Depends(seller_required),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).all()

    result = []

    for order in orders:
        items = db.query(OrderItem).filter(
            OrderItem.order_id == order.id
        ).all()

        seller_items = []

        for item in items:
            product = db.query(Product).filter(
                Product.id == item.product_id,
                Product.seller_id == current_user.id
            ).first()

            if product:
                seller_items.append({
                    "product_id": product.id,
                    "product_name": product.name,
                    "quantity": item.quantity,
                    "price": item.price
                })

        if seller_items:
            result.append({
                "order_id": order.id,
                "user_id": order.user_id,
                "total_amount": order.total_amount,
                "status": order.status,
                "address": order.address,
                "items": seller_items
            })

    return result

@app.put("/seller/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    status: str,
    current_user: User = Depends(seller_required),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    items = db.query(OrderItem).filter(
        OrderItem.order_id == order.id
    ).all()

    seller_has_product = False

    for item in items:
        product = db.query(Product).filter(
            Product.id == item.product_id,
            Product.seller_id == current_user.id
        ).first()

        if product:
            seller_has_product = True
            break

    if not seller_has_product:
        raise HTTPException(
            status_code=403,
            detail="You cannot update this order"
        )

    allowed_status = ["placed", "shipped", "delivered", "cancelled"]

    if status not in allowed_status:
        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )

    order.status = status
    db.commit()

    return {
        "message": "Order status updated",
        "status": order.status
    }

@app.get("/admin/users")
def get_all_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admin can access this"
        )

    return db.query(User).all()

@app.delete("/admin/users/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admin can delete users"
        )

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Admin cannot delete itself"
        )

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}

@app.get("/admin/products")
def get_all_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admin can access this"
        )

    return db.query(Product).all()

@app.delete("/admin/products/{product_id}")
def admin_delete_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admin can delete products"
        )

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}

@app.get("/admin/orders")
def get_all_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admin can access this"
        )

    return db.query(Order).all()