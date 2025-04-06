import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import { debounce } from 'lodash';
import { useSearchParams, useNavigate } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search');
  const navigate = useNavigate();

  useEffect(() => {
    const debouncedFetch = debounce(fetchProducts, 300);

    debouncedFetch();

    return () => debouncedFetch.cancel();
  }, [search]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = 'http://127.0.0.1:8000/products/?';

      if (search) url += `search=${search}&`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const newSearch = event.target.value;
    setSearchParams({ search: newSearch });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/products?search=${searchParams.get('search')}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <form onSubmit={handleSearchSubmit} className="flex border-2 border-black rounded-full overflow-hidden mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 flex-grow focus:outline-none"
          value={searchParams.get('search') || ''}
          onChange={handleSearchChange}
        />
        <button type="submit" className="bg-black text-white p-2 flex items-center justify-center cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="16.65" y1="16.65" x2="22" y2="22" />
          </svg>
        </button>
      </form>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ProductList products={products} />
    </div>
  );
}

export default Products;