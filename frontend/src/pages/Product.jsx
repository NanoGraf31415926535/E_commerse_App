import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail';

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const response = await fetch(`http://127.0.0.1:8000/products/${id}`);
    const data = await response.json();
    setProduct(data);
  };

  return <ProductDetail product={product} />;
}

export default Product;