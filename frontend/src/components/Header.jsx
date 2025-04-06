import React, { useState, useEffect, useRef } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, UserIcon, SearchIcon, ClipboardListIcon } from '@heroicons/react/outline';
import Home from '../pages/Home'; // Import your Home component
import Products from '../pages/Products'; // Import your Products component
import Product from '../pages/Product'; // Import your Product component
import CartPage from '../pages/CartPage'; // Import your CartPage component
import LoginPage from '../pages/LoginPage'; // Import your LoginPage component
import SignupPage from '../pages/SignupPage'; // Import your SignupPage component
import OrderHistoryPage from '../pages/OrderHistoryPage'; // Import your OrderHistoryPage component
import AccountPage from '../pages/AccountPage';

const searchVariants = {
    hidden: { opacity: 0, width: 0, x: 20 },
    visible: { opacity: 1, width: 'auto', x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { opacity: 0, width: 0, x: -20, transition: { duration: 0.2 } },
};

function Header() {
    const [search, setSearch] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

    // Focus input when it appears
    useEffect(() => {
        if (showSearchInput && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showSearchInput]);

    const handleSearchClick = () => {
        setShowSearchInput(!showSearchInput);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/products?search=${search}`);
        setShowSearchInput(false);
    };

    return (
        <header className="bg-white/90 backdrop-blur-md shadow-md py-3 px-6 sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center hover:scale-105 transition-transform">
                        <img src="/woocommerce-logo.png" alt="E-Commerce Logo" className="h-10 w-auto mr-2" />
                        <span className="font-semibold text-xl text-gray-800">My Shop</span> {/* Added a text brand */}
                    </Link>
                </div>

                <nav className="flex items-center space-x-6">
                    <div className="relative">
                        <button
                            onClick={handleSearchClick}
                            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                        >
                            <SearchIcon className="h-5 w-5" />
                        </button>
                        <AnimatePresence>
                            {showSearchInput && (
                                <motion.form
                                    variants={searchVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    onSubmit={handleSearchSubmit}
                                    className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-full overflow-hidden flex items-center border border-gray-200"
                                >
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={search}
                                        onChange={handleSearchChange}
                                        className="p-2 pl-3 pr-1 flex-grow focus:outline-none w-48 sm:w-64" // Increased width
                                        ref={searchInputRef}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white p-2.5 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                                        aria-label="Search"
                                    >
                                        <SearchIcon className="h-5 w-5" />
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                    <Link
                        to="/cart"
                        className="text-gray-600 hover:text-gray-900 transition-colors flex items-center hover:scale-105"
                    >
                        <ShoppingCartIcon className="h-5 w-5" />
                        <span className="hidden sm:inline-block font-medium">Cart</span>
                    </Link>
                    <Link
                        to="/orders"
                        className="text-gray-600 hover:text-gray-900 transition-colors flex items-center hover:scale-105"
                    >
                        <ClipboardListIcon className="h-5 w-5" />
                        <span className="hidden sm:inline-block font-medium">Orders</span>
                    </Link>
                    <Link
                        to="/login"
                        className="text-gray-600 hover:text-gray-900 transition-colors flex items-center hover:scale-105"
                    >
                        <UserIcon className="h-5 w-5" />
                        <span className="hidden sm:inline-block font-medium">Login</span>
                    </Link>
                    <Link
                        to="/signup"
                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors hover:scale-105 font-medium"
                    >
                        Signup
                    </Link>
                </nav>
            </div>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<Product />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />
                <Route path="/account" element={<AccountPage />} /> 
            </Routes>
        </header>
    );
}

export default Header;