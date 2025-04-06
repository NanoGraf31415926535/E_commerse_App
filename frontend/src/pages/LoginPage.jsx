import React, { useState } from 'react';
import Login from '../components/Login';

function LoginPage() {
  const [token, setToken] = useState(null);

  const handleLogin = (data) => {
    setToken(data.access_token);
    console.log('Login successful:', data);
    // Store token, redirect, etc.
  };

  return <Login onLogin={handleLogin} />;
}

export default LoginPage;