'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import Loading from '@/app/loading';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user, loadingMain } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [updatedRoles, setUpdatedRoles] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!loadingMain && user?.position !== 'Admin') {
      router.replace('/login');
    } else {
      axios
        .get('/api/admin/fetch-users')
        .then((response) => setUsers(response.data.data))
        .catch((error) => console.error('Error fetching users:', error));
    }
  }, [user, loadingMain, router]);

  const handleRoleSelect = (userId, newRole) => {
    setUpdatedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleRoleUpdate = (userId) => {
    const newRole = updatedRoles[userId];
    if (!newRole) {
      toast.error('No role changes made.');
      return;
    }
console.log(newRole,userId)
    axios
      .post('/api/admin/update-role', { userId, newRole })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, position: newRole } : user
          )
        );
        toast.success('Role updated successfully!');
        setUpdatedRoles((prev) => {
          const { [userId]: _, ...rest } = prev;
          return rest;
        });
      })
      .catch((error) => console.error('Error updating user role:', error));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loadingMain) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 mt-20">
      <h1 className="text-white text-3xl mb-4">Admin Panel</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Gmail..."
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 rounded-md w-full bg-gray-800 text-white"
        />
      </div>
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="flex justify-between items-center bg-gray-700 p-4 rounded-md"
          >
            <span className="text-white">{user.email}</span>
            <div className="flex items-center space-x-4">
              <select
                value={updatedRoles[user._id] || user.position}
                onChange={(e) => handleRoleSelect(user._id, e.target.value)}
                className="bg-gray-800 text-white p-2 rounded-md"
              >
                <option value="Student">Student</option>
                <option value="ClubHead">ClubHead</option>
                <option value="Admin">Admin</option>
              </select>
              <button
                onClick={() => handleRoleUpdate(user._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
