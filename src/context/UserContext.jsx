'use client'
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';




const UserContext = createContext();


export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingMain, setLoadingMain] = useState(true);
 

  const verifyAuth = async () => {
    try {
      setLoadingMain(true);
      const response = await axios.get('/api/auth/verify-auth',{withCredentials:true});
      console.log(response.data)

      if (response.data.success) {
        setUser(response.data.data);
      } else {
        setUser(null);
   
      }
    } catch (error) {
      console.error('Error verifying auth:', error);
      setUser(null);

    } finally {
      setLoadingMain(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  return (
    <UserContext.Provider value={{ user, loadingMain ,setUser}}>
      {children}
    </UserContext.Provider>
  );
};
