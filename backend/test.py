import sqlite3

def add_product(db_path, name, description, price):
    """
    Adds a product to the SQLite database.

    Args:
        db_path (str): The path to the SQLite database file.
        name (str): The name of the product.
        description (str): The description of the product.
        price (float): The price of the product.
    """
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO products (name, description, price)
            VALUES (?, ?, ?)
            """,
            (name, description, price),
        )

        conn.commit()
        print(f"Product '{name}' added successfully!")

    except sqlite3.Error as e:
        print(f"Error adding product: {e}")

    finally:
        if conn:
            conn.close()

# Example usage:
db_path = "/Users/artemsakhniuk/Desktop/React/ecommerce-app/backend/ecommerce.db"

add_product(db_path, "Laptop", "Powerful laptop for work and play.", 1200.00)
add_product(db_path, "Smartphone", "High-end smartphone with great camera.", 800.00)
add_product(db_path, "Headphones", "Noise-cancelling headphones for immersive audio.", 150.00)
add_product(db_path, "Monitor", "27-inch 4K monitor.", 300.00)
add_product(db_path, "Keyboard", "Mechanical keyboard for gaming.", 100.00)
add_product(db_path, "Wireless Mouse", "Ergonomic wireless mouse.", 50.00)
add_product(db_path, "Gaming Console", "Next-gen gaming console.", 500.00)
add_product(db_path, "Tablet", "10-inch tablet for entertainment.", 250.00)
add_product(db_path, "Camera", "Mirrorless digital camera.", 700.00)
add_product(db_path, "Smartwatch", "Fitness tracking smartwatch.", 200.00)