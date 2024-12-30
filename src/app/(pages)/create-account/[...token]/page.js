'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'; 
import { FaSpinner } from 'react-icons/fa'; 

export default function VerifyEmail({params}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { token } = params;

  useEffect(() => {
    if (!token) {
      setError('Invalid verification link.');
      toast.error('Invalid verification link.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please fill in all fields.');
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true); 

    try {
   
      const response = await axios.post('/api/auth/signup', { token:token[0], username, password });
      if(response.data.success){
        setMessage('Account Created Successfully');
        toast.success('Account Created Successfully');
        router.replace('/login'); }
        else{
          setError(response.data.message)
          toast.error(response.data.message);
        }
    
    } catch (err) {
      setError('Verification failed. Please try again.');
      toast.error('Verification failed. Please try again.'); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 bg-gray-700 border border-gray-600 rounded-md outline-none"
            placeholder='Enter Your Username'
            required
          />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 bg-gray-700 border border-gray-600 rounded-md outline-none"
            placeholder='Enter Your Password'
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
              'Create Account'
            )}
          </button>
          {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
          {message && <p className="text-green-400 mt-2 text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
}
