'use client';

import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast'; 
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {setUser} = useUser()
  const router = useRouter()
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
      const response = await axios.post('/api/auth/login',{email,password},{withCredentials:true})
      if(response.data.success){
  
      toast.success('Logged In Successfully');
      setUser(response.data.data)
    router.replace('/events')}
      else{
        console.log(response.data)
        setError(response.data.message)
        toast.error(response.data.message);
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
      toast.error('Failed to login. Please try again.');
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
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
              'Login'
            )}
          </button>
          {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
        </form>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-blue-400 hover:text-blue-300 text-sm">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
}
