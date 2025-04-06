import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import { CartProvider } from './functions/CartContext.jsx'; // Import CartProvider

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        {/* Your other routes and components will go here */}
      </Router>
    </CartProvider>
  );
}

export default App;