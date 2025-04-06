from fastapi import FastAPI, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, Session
import models, schemas
from models import Base
from sqlalchemy import or_, select
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Annotated, List, Optional
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database URL
DATABASE_URL = "sqlite:///./ecommerce.db"  # or your PostgreSQL url.

# Use the async engine
ASYNC_DB_URL = "sqlite+aiosqlite:///./ecommerce.db"  #  Added aiosqlite for async
async_engine = create_async_engine(ASYNC_DB_URL, echo=True)


async def get_async_db():
    async_session = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


# Create tables (synchronously, for Alembic)
# Alembic should handle this, but for direct execution
from sqlalchemy import create_engine
engine = create_engine(DATABASE_URL, echo=True)  # Use the synchronous DATABASE_URL
Base.metadata.create_all(bind=engine)


SECRET_KEY = "your-secret-key"  # Replace with a strong, random key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: AsyncSession = Depends(get_async_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        # Use async session to fetch the user
        result = await db.execute(select(models.User).filter(models.User.username == username))
        user = result.scalar_one_or_none()

        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception



@app.post("/users/", response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: AsyncSession = Depends(get_async_db)):
    # Use async session to check if user exists
    result = await db.execute(select(models.User).filter(models.User.username == user.username))
    db_user = result.scalar_one_or_none()

    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user



@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: AsyncSession = Depends(get_async_db),
):
    # Use async session to get the user
    result = await db.execute(select(models.User).filter(models.User.username == form_data.username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}



@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(
    current_user: Annotated[models.User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_async_db),
):
    # Return the current user
    return current_user



@app.post("/orders/", response_model=schemas.Order)
async def create_order(
    order: schemas.OrderCreate,
    current_user: Annotated[models.User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_async_db),
):
    db_order = models.Order(user_id=current_user.id, total=order.total)
    db.add(db_order)
    await db.commit()
    await db.refresh(db_order)

    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id, product_id=item.product_id, quantity=item.quantity
        )
        db.add(db_item)
    await db.commit()
    return db_order



@app.get("/orders/", response_model=List[schemas.Order])
async def read_orders(
    current_user: Annotated[models.User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_async_db),
):
    # Use async session
    result = await db.execute(select(models.Order).filter(models.Order.user_id == current_user.id))
    orders = result.scalars().all()
    return orders



@app.get("/products/", response_model=List[schemas.Product])
async def read_products(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    db: AsyncSession = Depends(get_async_db),
):
    try:
        # Use async session
        query = select(models.Product)

        if search:
            query = query.filter(
                or_(
                    models.Product.name.ilike(f"%{search}%"),
                    models.Product.description.ilike(f"%{search}%"),
                )
            )

        if min_price is not None:
            query = query.filter(models.Product.price >= min_price)

        if max_price is not None:
            query = query.filter(models.Product.price <= max_price)

        result = await db.execute(query.offset(skip).limit(limit))
        products = result.scalars().all()  # Fetch results
        return products
    except Exception as e:
        print(f"Database error: {e}")  # Print error to console.
        raise HTTPException(
            status_code=500, detail="Database error"
        )  # return error to client.



@app.get("/products/{product_id}", response_model=schemas.Product)
async def read_product(product_id: int, db: AsyncSession = Depends(get_async_db)):
    # Use async session
    result = await db.execute(select(models.Product).filter(models.Product.id == product_id))
    product = result.scalar_one_or_none()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product