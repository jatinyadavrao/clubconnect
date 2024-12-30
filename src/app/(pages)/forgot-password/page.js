'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; 
import { FaSpinner } from 'react-icons/fa';
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address.');
      toast.error('Please enter your email address.');
      return;
    }

    setLoading(true); 
    setError(''); 

    try {

      const  response = await axios.post('/api/auth/forgot-password', { email });
      if(response.data.success){
      setMessage('Password reset email sent successfully!');
      toast.success('Password reset email sent successfully!'); }
      else{
        setError(response.data.message)
        toast.error(response.data.message)
      }
    } catch (err) {
      setError('Failed to send password reset email. Please try again.');
      toast.error('Failed to send password reset email. Please try again.'); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 bg-gray-700 border border-gray-600 rounded-md outline-none"
            placeholder="Enter Your Email"
            required
          />
          <button
            type="submit"
            className={`bg-green-900 border border-green-800 font-bold px-4 py-2 rounded-lg transition-all duration-300 ${loading ? 'cursor-wait' : 'hover:bg-green-600'}`}
            disabled={loading}
          >
           {loading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" /> Sending...
              </div>
            ) : (
              'Send Password Reset Link'
            )}
          </button>
          {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
          {message && <p className="text-green-400 mt-2 text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
}
