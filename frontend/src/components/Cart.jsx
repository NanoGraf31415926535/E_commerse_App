import React, { useState, useEffect } from 'react';
import { useCart } from '../functions/CartContext.jsx'; // Adjust the path if necessary
import { Trash2, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart = () => {
    const { cart, removeFromCart } = useCart();
    const [quantities, setQuantities] = useState({});
    const [shippingCost, setShippingCost] = useState(10); // Default shipping cost
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const initialQuantities = {};
        cart.forEach(item => {
            initialQuantities[item.id] = 1;
        });
        setQuantities(initialQuantities);
    }, [cart]);

      useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // Example: Mobile breakpoint at 768px
        };

        handleResize(); // Check on initial load
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const calculateItemTotal = (item) => {
        return item.price * (quantities[item.id] || 1);
    };

    const calculateCartTotal = () => {
        return cart.reduce((total, item) => total + calculateItemTotal(item), 0);
    };

    const handleQuantityChange = (itemId, value) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue > 0) {
            setQuantities(prevQuantities => ({
                ...prevQuantities,
                [itemId]: numValue,
            }));
        } else {
             setQuantities(prevQuantities => ({
                ...prevQuantities,
                [itemId]: 1,
            }));
        }

    };

    const handleRemove = (itemId) => {
        removeFromCart(itemId);
        // Also remove quantity state for that item
        setQuantities(prevQuantities => {
            const newQuantities = { ...prevQuantities };
            delete newQuantities[itemId];
            return newQuantities;
        });
    };

    const handleIncrement = (itemId) => {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: (prevQuantities[itemId] || 1) + 1,
      }));
    };

    const handleDecrement = (itemId) => {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: Math.max(1, (prevQuantities[itemId] || 1) - 1), // Ensure quantity doesn't go below 1
      }));
    };


    const shippingOptions = [
        { label: 'Standard shipping - $10.00', value: 10 },
        { label: 'Express shipping - $25.00', value: 25 },
        { label: 'Free shipping - $0.00', value: 0 }
    ];

    return (
        <div className="container mx-auto mt-8 lg:mt-16">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Shopping Cart</h1>

            {cart.length === 0 ? (
                <div className="text-gray-500 text-lg">Your cart is empty.</div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="w-full lg:w-3/4">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className={`flex flex-col sm:flex-row items-center justify-between py-4 border-b border-gray-200 ${cart.indexOf(item) === cart.length - 1 ? '' : ''}`}
                            >
                                <div className="flex items-center gap-4 w-full sm:w-2/5 mb-4 sm:mb-0">
                                    <div className="w-24 h-24">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                                        <p className="text-gray-500 text-sm">Brand</p> {/* Add brand if available */}
                                    </div>
                                </div>

                                  <div className="flex items-center justify-center w-full sm:w-1/5 my-4 sm:my-0">
                                    <div className="flex items-center">
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDecrement(item.id)}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-l-md py-2 px-3"

                                        >
                                            <ChevronDown className="h-4 w-4" />
                                        </motion.button>
                                        <input
                                            type="text"
                                            value={quantities[item.id] || 1}
                                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                            className="w-16 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleIncrement(item.id)}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-r-md py-2 px-3"
                                        >
                                             <ChevronUp className="h-4 w-4" />
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="w-full sm:w-1/5 text-center font-semibold text-gray-800">
                                    ${item.price.toFixed(2)}
                                </div>
                                <div className="w-full sm:w-1/5 text-center font-bold text-gray-900">
                                    ${calculateItemTotal(item).toFixed(2)}
                                </div>
                                <div className="w-full sm:w-1/5 text-right">
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleRemove(item.id)}
                                        className="text-gray-500 hover:text-red-500"

                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </motion.button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-1/4">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                            <div className="flex justify-between mt-4 mb-4">
                                <span className="text-sm font-medium text-gray-600">Items ({cart.length})</span>
                                <span className="text-sm font-bold text-gray-800">${calculateCartTotal().toFixed(2)}</span>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="shipping" className="block text-sm font-medium text-gray-600 mb-2">
                                    Shipping
                                </label>
                                <select
                                    id="shipping"
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                     value={shippingCost}
                                     onChange={(e) => setShippingCost(parseFloat(e.target.value))}
                                >
                                    {shippingOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="border-t border-gray-200 mt-6 pt-6">
                                <div className="flex justify-between py-3 text-sm font-semibold uppercase">
                                    <span className="text-gray-700">Total cost</span>
                                    <span className="text-xl font-bold text-gray-900">${(calculateCartTotal() + shippingCost).toFixed(2)}</span>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"

                                >Checkout</motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;