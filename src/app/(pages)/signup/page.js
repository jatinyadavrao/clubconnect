'use client';

import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa'; 
import toast from 'react-hot-toast'; 
import axios from 'axios';
export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.endsWith('@iiitu.ac.in')) {
      setError('Please enter a valid email address ending with @iiitu.ac.in');
      toast.error('Please enter a valid email address ending with @iiitu.ac.in');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/verify-mail',{email})
      if(response.data.success){
      setMessage('Verification email sent! Please check your inbox.');
      toast.success('Verification email sent! Please check your inbox.');}
      else{
        setError(response.data.message)
        toast.error(response.data.message);
      }
    } catch (err) {
      setError('Failed to send verification email. Please try again.');
      toast.error('Failed to send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Verify Your Email</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 bg-gray-700 border border-gray-600 rounded-md outline-none"
            placeholder='Enter Your Email'
            required
          />
          <button
            type="submit"
            className={`bg-green-900 border border-green-800 font-bold px-4 py-2 rounded-lg transition-all duration-300 ${loading ? 'cursor-wait' : 'hover:bg-green-600'}`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" /> Loading...
              </div>
            ) : (
              'Send Verification Link'
            )}
          </button>
          {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
          {message && <p className="text-green-400 mt-2 text-center">{message}</p>}
        </form>
      </div>
   
    </div>
  );
}
