from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "customer"


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    
class CategoryCreate(BaseModel):
    name: str


class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    discount_price: float | None = None
    stock: int
    image_url: str | None = None
    category_id: int

class ProductUpdate(BaseModel):
    name:str|None=None
    description:str|None=None
    price:float|None=None 
    discount_price:float|None=None 
    stock:int|None=None 
    image_url:str|None=None 
    category_id:int | None = None

class CartItemCreate(BaseModel):
    product_id:int  
    quantity:int=1

class OrderCreate(BaseModel):
    address:str

class WishlistCreate(BaseModel):
    product_id:int

