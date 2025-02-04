'use client'
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'; // Ensure toast is imported
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fingerprintAuthorized, setFingerprintAuthorized] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login process
    setFingerprintAuthorized(true);  // Set fingerprint as authorized
    toast.success('Fingerprint authorized!');
    setIsLoggedIn(true);  // Log in the user
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f0f4f8]">
      <div className="w-full sm:w-96 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
        
        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 justify-center">
              <img src="fingerprint.gif" className="col-span-4" alt="Fingerprint" />
            </div>
          </div>

          {/* Fingerprint Authorization */}
          <div>
            <p className={fingerprintAuthorized ? 'text-green-500' : 'text-red-500'}>
              {fingerprintAuthorized ? 'Fingerprint Authorized' : 'Authorize your fingerprint'}
            </p>
          </div>

          {!isLoggedIn ? (
            <div>
              <button 
                type="submit"  // Ensure it's a submit button for form handling
                className="w-full py-2 bg-[#4285f4] text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Log In
              </button>
            </div>
          ) : (
            <div>
              <Link href="/createwallet">
                <button className="w-full py-2 bg-[#34d399] text-white rounded-md hover:bg-green-600 transition duration-200">
                  Go to Dashboard
                </button>
              </Link>
            </div>
          )}
        </form>

        {/* Redirect to Sign-Up if not logged in */}
        {!isLoggedIn && (
          <div className="text-center text-sm text-blue-500 mt-4">
            <Link href="/" className="hover:underline">
              Don't have an account? Sign Up
            </Link>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
