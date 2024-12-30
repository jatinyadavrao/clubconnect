'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBell, FaChevronDown } from 'react-icons/fa';
import LogoutButton from './LogOutBtn'; // Import the LogoutButton component
import { useUser } from '@/context/UserContext';
import toast from 'react-hot-toast';
import axios from 'axios';
export default function NavBar() {
  const [menu, setMenu] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [clubHeadOpen, setClubHeadOpen] = useState(false);
  const { user } = useUser(); // Access user from context
  const [notifications,setNotifications ]= useState([]);
useEffect(() => {
  if (!user) return;

  const fetchNotifications = async () => {
    try {
      const res = await axios.post('/api/events/notifications/get', { userId: user._id });
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Error fetching notifications');
    }
  };

  fetchNotifications();
}, [user])
  const toggleMenu = () => setMenu(!menu);
  const closeMenu = () => setMenu(false);
  const toggleNotifications = () => setNotificationOpen(!notificationOpen);
  const toggleClubHead = () => setClubHeadOpen(!clubHeadOpen);
  const seenNotification = async (id) => {
    try {
      const res = await axios.post('/api/events/notifications/seen', {
        userId: user._id,
        notificationId: id,
      });
      if (res.data.success) {
        setNotifications((prev) => prev.filter((notif) => notif._id !==id));
      }
    } catch (error) {
      console.error('Error marking notification as seen:', error);
      toast.error('Error marking notification as seen');
  }}
  return (
    <nav className="bg-gray-800 p-4 shadow-lg fixed w-full top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="/logo2.png" alt="ClubConnect Logo" width={50} height={50} />
          <span className="text-white text-2xl font-bold ml-2">ClubConnect</span>
        </div>

        {/* Notification and Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          {/* Notifications */}
          <button
            className="text-white text-lg p-2 rounded-full hover:bg-gray-700 focus:outline-none"
            onClick={toggleNotifications}
          >
            <FaBell className="w-6 h-6" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="text-white focus:outline-none w-8 h-8 flex items-center justify-center bg-gray-700 rounded"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {/* Notifications Button */}
          <div className="relative">
            <button
              className="text-white text-lg p-2 rounded-full hover:bg-gray-700 focus:outline-none"
              onClick={toggleNotifications}
            >
              <FaBell className="w-6 h-6" />
            </button>
            {notificationOpen && (
              <div className="absolute bg-gray-700 mt-2 rounded-lg shadow-lg w-64 z-50">
                <div className="p-4 text-white font-semibold">Notifications</div>
                <div className="divide-y divide-gray-600">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div key={notif._id} className="p-4 text-sm text-white hover:bg-gray-600 flex justify-between items-center">
                        {notif.message}
                        <button onClick={()=>{seenNotification(notif._id)}} className='bg-green-700 text-white font-bold px-2 py-2 rounded cursor-pointer'>seen</button>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-gray-300">No new notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Links */}
          <Link href="/" passHref>
            <span className="text-white text-lg font-semibold hover:text-gray-400 cursor-pointer">Home</span>
          </Link>
          <Link href="/events" passHref>
            <span className="text-white text-lg font-semibold hover:text-gray-400 cursor-pointer">Events</span>
          </Link>
          {user &&(
          <Link href="/feedback-forms" passHref>
            <span className="text-white text-lg font-semibold hover:text-gray-400 cursor-pointer">Feedback Forms</span>
          </Link>)}
          {user && user.position === 'Admin' && (
            <Link href="/admin-panel" passHref>
              <span
                className="text-white text-lg font-semibold hover:text-gray-400 cursor-pointer"
              >
                Admin Panel
              </span>
            </Link>
         )}
          {/* ClubHead Panel Dropdown (Only for ClubHeads) */}
          {user && (user.position === 'ClubHead' || user.position=='Admin') && (
            <div className="relative">
              <button
                className="flex items-center text-white text-lg font-semibold hover:text-gray-400"
                onClick={toggleClubHead}
              >
                ClubHead Panel <FaChevronDown className="ml-1" />
              </button>
              {clubHeadOpen && (
                <div className="absolute bg-gray-700 shadow-lg rounded-md mt-2 py-2 w-48">
                  <Link href="/create-event" passHref>
                    <span className="block px-4 py-2 text-white hover:bg-gray-600 cursor-pointer">
                      Create Event
                    </span>
                  </Link>
                  <Link href="/submissions" passHref>
                    <span className="block px-4 py-2 text-white hover:bg-gray-600 cursor-pointer">
                      View Submissions
                    </span>
                  </Link>
                  <Link href="/manage-feedback" passHref>
                    <span className="block px-4 py-2 text-white hover:bg-gray-600 cursor-pointer">
                      Manage Feedback
                    </span>
                  </Link>
                </div>
              )}
            </div>
          )}

          <Link href="/about" passHref>
            <span className="text-white text-lg font-semibold hover:text-gray-400 cursor-pointer">About</span>
          </Link>

          {user ? (
            <LogoutButton closemenu={closeMenu} />
          ) : (
            <>
              <Link href="/login" passHref>
                <span className="text-white text-lg font-semibold hover:text-gray-400 cursor-pointer">Login</span>
              </Link>
              <Link href="/signup" passHref>
                <span className="text-white text-lg font-semibold bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 transition-all duration-300">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-16 left-0 w-full bg-gray-800 transition-all duration-300 ease-in-out ${
          menu ? 'max-h-screen' : 'max-h-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col items-start p-4 space-y-4">
          <Link href="/" passHref>
            <span
              className="text-white text-lg font-semibold hover:text-gray-400 cursor-pointer"
              onClick={closeMenu}
            >
              Home
            </span>
          </Link>
          <Link href="/events" passHref>
            <span
              className="text-white text-lg font-semibold hover:text-gray-400 cursor-pointer"
              onClick={closeMenu}
            >
              Events
            </span>
          </Link>

          {/* ClubHead Dropdown (Only for ClubHeads) */}
          {user && (user.position === 'ClubHead' || user.position=='Admin') && (
            <div className="w-full">
              <button
                className="flex items-center justify-between w-full text-white text-lg font-semibold hover:text-gray-400"
                onClick={toggleClubHead}
              >
                ClubHead Panel
                <FaChevronDown className={`ml-1 transform ${clubHeadOpen ? 'rotate-180' : ''}`} />
              </button>
              {clubHeadOpen && (
                <div className="ml-4 mt-2">
                  <Link href="create-event" passHref>
                    <span
                      className="block px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                      onClick={closeMenu}
                    >
                      Create Event
                    </span>
                  </Link>
                  <Link href="submissions" passHref>
                    <span
                      className="block px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                      onClick={closeMenu}
                    >
                      View Submissions
                    </span>
                  </Link>
                  <Link href="/manage-feedback" passHref>
                    <span
                      className="block px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                      onClick={closeMenu}
                    >
                      Manage Feedback
                    </span>
                  </Link>
                </div>
              )}
            </div>
          )}
        
          <Link href="/about" passHref>
            <span
              className="text-white text-lg font-semibold hover:text-gray-400 cursor-pointer"
              onClick={closeMenu}
            >
              About
            </span>
            </Link>
            <Link href="/feedback-forms" passHref>
            <span
              className="text-white text-lg font-semibold hover:text-gray-400 cursor-pointer"
              onClick={closeMenu}
            >
              Feedback Forms
            </span>
          </Link>
    
         {user && user.position === 'Admin' && (
            <Link href="/admin-panel" passHref>
              <span
                className="text-white text-lg font-semibold hover:text-gray-400 cursor-pointer"
                onClick={closeMenu}
              >
                Admin Panel
              </span>
            </Link>
         )}

          {/* Show Login/Signup if User is not Logged In */}
          {user ? (
            <LogoutButton closemenu={closeMenu} />
          ) : (
            <>
              <Link href="/login" passHref>
                <span
                  className="text-white text-lg font-semibold hover:text-gray-400 cursor-pointer"
                  onClick={closeMenu}
                >
                  Login
                </span>
              </Link>
              <Link href="/signup" passHref>
                <span
                  className="text-white text-lg font-semibold bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 transition-all duration-300 "
                  onClick={closeMenu}
                >
                  Sign Up
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );

  }