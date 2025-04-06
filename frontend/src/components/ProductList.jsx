import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion
import ProductDetail from './ProductDetail';

const productVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
  hover: {
    scale: 1.03,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    transition: { duration: 0.2 },
  },
};

function ProductList({ products }) {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    if (products.length === 0) {
      const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch('http://127.0.0.1:8000/products/');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setProductList(data);
        } catch (err) {
          console.error('Failed to fetch products:', err);
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    } else {
      setLoading(false);
      setProductList(products);
    }
  }, [products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg
          className="animate-spin h-10 w-10 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    );
  }

  if (selectedProductId) {
    return <ProductDetail productId={selectedProductId} fromProducts={true} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {productList.map((product) => (
        <motion.div
          key={product.id}
          variants={productVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300
                    border border-gray-100 hover:border-blue-500/30 cursor-pointer" // Added hover border
          onClick={() => setSelectedProductId(product.id)}
        >
          <div className="relative">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover" // Adjusted height for consistency
              />
            )}
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
              {product.name}
            </h2>
            <p className="text-gray-500 text-sm mb-2 line-clamp-2">
              {product.description}
            </p>
            <p className="text-xl font-bold text-blue-600">
              ${product.price}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default ProductList;