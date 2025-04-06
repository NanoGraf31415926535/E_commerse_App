from pydantic import BaseModel

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True # updated config

class Token(BaseModel):
    access_token: str
    token_type: str

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int

class OrderItem(OrderItemBase):
    id: int

    class Config:
        from_attributes = True # updated config

class OrderBase(BaseModel):
    total: float
    items: list[OrderItemBase]

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    user_id: int
    items: list[OrderItem]

    class Config:
        from_attributes = True 

class ProductBase(BaseModel):
    name: str
    description: str
    price: float

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True