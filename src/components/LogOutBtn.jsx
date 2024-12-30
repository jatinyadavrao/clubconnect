'use client'
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
 import { FaSpinner } from 'react-icons/fa';
import { useUser } from '@/context/UserContext';
const LogoutButton = ({closemenu}) => {
  const router = useRouter();
  const [loading,setLoading] = useState(false)
  const {setUser} = useUser()
  const handleLogout = async () => {
    closemenu()
    setLoading(true)
    try {

      const response = await axios.get('/api/auth/logout',{withCredentials:true});
      if (response.data.success) {
        toast.success('Logged out successfully');
        setUser(null)
        router.replace('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error in logging out, please try again.');
    }

  finally{
    setLoading(false)
  }
};
  return (
    <button onClick={handleLogout} className="text-white text-lg font-semibold bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 transition-all duration-300">
      {loading?<FaSpinner className='animate-spin mr-2'/>:"Logout"}
    </button>
  );
};

export default LogoutButton;
