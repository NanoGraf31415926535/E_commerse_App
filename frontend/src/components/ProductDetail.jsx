import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../functions/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

const ProductDetail = ({ productId, fromProducts }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { cart, addToCart, removeFromCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://127.0.0.1:8000/products/${productId}`);
                if (!response.ok) {
                    let errorMessage = `HTTP error! status: ${response.status}`;
                    try {
                        const errorData = await response.json();
                        if (errorData.message) {
                            errorMessage += ` - ${errorData.message}`;
                        }
                    } catch (jsonError) {
                        console.error('failed to parse error json', jsonError);
                    }
                    throw new Error(errorMessage);
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                console.error('Failed to fetch product:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        addToCart(product);
    };

    const handleRemoveFromCart = () => {
        removeFromCart(product.id);
    };

    const isInCart = cart.some((item) => item.id === product.id);

    const handleGoBack = () => {
        if (fromProducts) {
            navigate('/products');
        } else {
            navigate(-1);
        }
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                Error: {error.message}
            </div>
        );
    }

    if (!product) {
        return <div className="flex justify-center items-center h-screen">Product not found.</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="max-w-4xl mx-auto px-4 py-8"
        >
            <button onClick={handleGoBack} className="mb-6 hover:bg-gray-100 flex items-center">
                Back
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    {product.imageUrl && (
                        <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full rounded-lg shadow-lg object-cover aspect-square"
                        />
                    )}
                </div>
                <div>
                    <h2 className="text-3xl font-semibold mb-4 text-gray-900">{product.name}</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
                    <p className="text-2xl font-bold text-green-600 mb-6">Price: ${product.price}</p>
                    {isInCart ? (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 flex items-center"
                            onClick={handleRemoveFromCart}
                        >
                            Remove from Cart
                        </motion.button>
                    ) : (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 flex items-center"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductDetail;