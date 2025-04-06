import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList'; // Assuming you have this component

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Set loading to true before fetching
      setError(null); // Reset error state
      try {
        const response = await fetch('http://127.0.0.1:8000/products/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err); // Set error state
      } finally {
        setLoading(false); // Set loading to false after fetching (or error)
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>; // Show loading message
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Show error message
  }

  return (
    <div className="p-4">
      <ProductList products={products} />
    </div>
  );
}

export default Home;