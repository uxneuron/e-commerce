from sqlalchemy import Column , Integer,String,Boolean ,Float,ForeignKey
from database import Base 

class User(Base):
    __tablename__='users' 
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String(100),nullable=False) 
    email=Column(String(150),unique=True,nullable=False,index=True)
    password=Column(String(255),nullable=False)
    role=Column(String(20),default='customer')
    is_active=Column(Boolean,default=True)

class Category(Base): 
    __tablename__='categories' 
    id=Column(Integer,primary_key=True,index=True) 
    name=Column(String(100),unique=True,nullable=False) 

class Product(Base):
    __tablename__='products' 
    id=Column(Integer,primary_key=True,index=True) 
    name=Column(String(200),nullable=False) 
    description=Column(String(1000)) 
    price=Column(Float,nullable=False) 
    discount_price=Column(Float) 
    stock=Column(Integer,default=0) 
    image_url=Column(String(500)) 
    category_id=Column(Integer,ForeignKey('categories.id')) 
    seller_id=Column(Integer,ForeignKey('users.id')) 
    is_active=Column(Boolean,default=True)

class Cart(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True)
    cart_id = Column(Integer, ForeignKey("carts.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)

class Order(Base):
    __tablename__='orders' 
    id=Column(Integer,primary_key=True) 
    user_id=Column(Integer,ForeignKey("users.id")) 
    total_amount=Column(Float,nullable=False) 
    status=Column(String(30),default="placed") 
    address=Column(String(500),nullable=False)

class OrderItem(Base):
    __tablename__="order_items" 
    id=Column(Integer,primary_key=True)
    order_id=Column(Integer,ForeignKey("orders.id"))
    product_id=Column(Integer,ForeignKey("products.id")) 
    quantity=Column(Integer,nullable=False) 
    price=Column(Float,nullable=False)


class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id")) 

    