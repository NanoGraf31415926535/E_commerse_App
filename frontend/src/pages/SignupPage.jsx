import React, { useState } from 'react';
import Signup from '../components/Signup';

function SignupPage() {
  const handleSignup = (data) => {
    console.log('Signup successful:', data);
    // Redirect, show success message, etc.
  };

  return <Signup onSignup={handleSignup} />;
}

export default SignupPage;