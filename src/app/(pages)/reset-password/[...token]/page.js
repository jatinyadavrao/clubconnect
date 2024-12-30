'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; 
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa'; 

export default function ResetPassword({params}) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { token } = params; 

  useEffect(() => {
    if (!token) {
      setError('Invalid or expired reset link.');
      toast.error('Invalid or expired reset link.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      toast.error('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true); 
    setError(''); 

    try {
     
    const response =  await axios.post('/api/auth/reset-password', { token:token[0], password });
 
     
      if(response.data.success){
        setMessage('Password has been reset successfully!');
        toast.success('Password has been reset successfully!'); 
        router.replace('/login');}
        else{
          setError(response.data.message)
          toast.error(response.data.message)
        }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Reset Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 bg-gray-700 border border-gray-600 rounded-md outline-none"
            placeholder="Enter New Password"
            required
          />
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 bg-gray-700 border border-gray-600 rounded-md outline-none"
            placeholder="Confirm New Password"
            required
          />
          <button
            type="submit"
            className={`bg-green-900 border border-green-800 font-bold px-4 py-2 rounded-lg transition-all duration-300 ${loading ? 'cursor-wait' : 'hover:bg-green-600'}`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" /> Resetting...
              </div>
            ) : (
              'Reset Password'
            )}
          </button>
          {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
          {message && <p className="text-green-400 mt-2 text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
}
