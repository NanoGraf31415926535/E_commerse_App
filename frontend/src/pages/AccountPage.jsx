import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsLoggedIn(true);
            const fetchUserData = async () => {
                setLoading(true);
                try {
                    const response = await fetch('http://127.0.0.1:8000/users/me/', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to fetch user data: ${response.status}`);
                    }
                    const data = await response.json();
                    setUserData(data);
                } catch (error) {
                    console.error('Error fetching user data:', error); // Log the error
                    setIsLoggedIn(false);
                    localStorage.removeItem('access_token');
                    navigate('/login');
                } finally {
                    setLoading(false);
                }
            };
            fetchUserData();
        } else {
            setIsLoggedIn(false);
            setLoading(false);
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);
        setUserData(null);
        navigate('/login');
    };

    if (loading) {
        return <div className="p-4">Loading account information...</div>;
    }

    if (!isLoggedIn) {
        return (
            <div className="p-4">
                <p>You are not logged in. Please log in to view your account.</p>
                <button onClick={() => navigate('/login')}>Login</button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-4">Account Page</h1>
            <div className='w-full max-w-md border rounded p-4'>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Your Profile</h2>
                    <p className="text-sm text-gray-500">This is your account information.</p>
                </div>
                {userData ? (
                    <div className="space-y-4">
                        <p><strong>Username:</strong> {userData.username}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <p>No user data available.</p>
                )}
            </div>
        </div>
    );
};

export default AccountPage;