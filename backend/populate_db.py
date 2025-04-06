from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Product

DATABASE_URL = "sqlite:///./ecommerce.db" #or your postgres url.
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def list_products():
    db = SessionLocal()
    products = db.query(Product).all()

    if not products:
        print("No products found in the database.")
        return

    print("List of Products:")
    for product in products:
        print(f"ID: {product.id}, Name: {product.name}, Description: {product.description}, Price: ${product.price}")

    db.close()

if __name__ == "__main__":
    list_products()