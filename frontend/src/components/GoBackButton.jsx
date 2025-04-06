import React from 'react';
import { useNavigate } from 'react-router-dom';

function GoBackButton({ children = 'Go Back', className = '' }) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button onClick={handleGoBack} className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ${className}`}>
      {children}
    </button>
  );
}

export default GoBackButton;