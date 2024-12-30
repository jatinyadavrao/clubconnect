'use client';

import Loading from "@/app/loading";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function CreateEvent() {
    const { loadingMain, user } = useUser();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [maxMembers, setMaxMembers] = useState('');
    const [minMembers, setMinMembers] = useState('');
    const [driveLink, setDriveLink] = useState('');
    const [registrationStart, setRegistrationStart] = useState('');
    const [registrationEnd, setRegistrationEnd] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(false); 
    const MAX_TITLE_WORDS = 10;
    const MAX_DESCRIPTION_WORDS = 50;

    if (loadingMain) {
        return <Loading />;
    } else {
        if (!user && (!user?.role==='ClubHead' || !user?.role==='Admin')) {
            toast.error('Please Login First or you are not authorized');
            router.replace('/login');
            return null;
        } else {
            const handleFormSubmit = async (event) => {
                event.preventDefault();
                setLoading(true); 

                const formData = new FormData();
                formData.set('title', title);
                formData.set('description', description);
                formData.set('maxMembers', maxMembers);
                formData.set('minMembers', minMembers);
                formData.set('driveLink', driveLink);
                formData.set('registrationStart', registrationStart);
                formData.set('registrationEnd', registrationEnd);
                formData.set('eventDate', eventDate);
                formData.set('poster', image);
                formData.set('id', user._id);
                
                try {
                    const response = await axios.post('/api/events/create-event', formData);

                    if (response.data.success) {
                        toast.success('Event created successfully');
                     
                        setTitle('');
                        setDescription('');
                        setMaxMembers('');
                        setMinMembers('');
                        setDriveLink('');
                        setRegistrationStart('');
                        setRegistrationEnd('');
                        setEventDate('');
                        setImage(null);
                        setUrl(null);
                    } else {
                        toast.error('Error in creating event');
                    }
                } catch (error) {
                    console.error('Error in creating event:', error);
                    toast.error('Error in creating event');
                } finally {
                    setLoading(false); 
                }
            };

            const handleImageChange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    setImage(file);
                    previewImage(file);
                }
            };

            const previewImage = (data) => {
                const urll = URL.createObjectURL(data);
                setUrl(urll);
            };

            const handleWordLimit = (text, maxWords) => {
                const words = text.split(' ');
                if (words.length > maxWords) {
                    return words.slice(0, maxWords).join(' ');
                }
                return text;
            };

            return (
                <div className="bg-gray-900 min-h-screen p-8">
                    <h1 className="text-3xl font-bold text-white mb-6">Create Event</h1>
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                            <input
                                type="text"
                                placeholder="Event Title (Max 10 words)"
                                value={title}
                                onChange={(e) => setTitle(handleWordLimit(e.target.value, MAX_TITLE_WORDS))}
                                className="border border-gray-700 bg-gray-700 text-white p-2 mb-2 w-full rounded outline-none"
                                required
                            />
                            <textarea
                                placeholder="Event Description (Max 50 words)"
                                value={description}
                                onChange={(e) => setDescription(handleWordLimit(e.target.value, MAX_DESCRIPTION_WORDS))}
                                className="border border-gray-700 bg-gray-700 text-white p-2 mb-2 w-full rounded outline-none"
                                rows="4"
                                required
                            />
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                            <input
                                type="number"
                                placeholder="Maximum Members in a Team"
                                value={maxMembers}
                                onChange={(e) => setMaxMembers(e.target.value)}
                                className="border border-gray-700 bg-gray-700 text-white p-2 mb-2 w-full rounded outline-none"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Minimum Members in a Team"
                                value={minMembers}
                                onChange={(e) => setMinMembers(e.target.value)}
                                className="border border-gray-700 bg-gray-700 text-white p-2 w-full rounded outline-none"
                                required
                            />
                        </div>
                        <input
                            type="url"
                            placeholder="Google Drive Link"
                            value={driveLink}
                            onChange={(e) => setDriveLink(e.target.value)}
                            className="border border-gray-700 bg-gray-700 text-white p-2 w-full rounded mb-4 outline-none"
                            required
                        />
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                            <label className="text-white mb-2 block">Registration Start Date</label>
                            <input
                                type="datetime-local"
                                value={registrationStart}
                                onChange={(e) => setRegistrationStart(e.target.value)}
                                className="border border-gray-700 bg-gray-700 text-white p-2 w-full rounded mb-4 outline-none"
                                required
                            />
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                            <label className="text-white mb-2 block">Registration End Date</label>
                            <input
                                type="datetime-local"
                                value={registrationEnd}
                                onChange={(e) => setRegistrationEnd(e.target.value)}
                                className="border border-gray-700 bg-gray-700 text-white p-2 w-full rounded mb-4 outline-none"
                                required
                            />
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                            <label className="text-white mb-2 block">Event Date</label>
                            <input
                                type="datetime-local"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                className="border border-gray-700 bg-gray-700 text-white p-2 w-full rounded mb-4 outline-none"
                                required
                            />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            name="poster"
                            className="border border-gray-700 bg-gray-700 text-white p-2 w-full rounded mb-4 outline-none"
                            required
                        />
                        {url && (
                            <img
                                src={url}
                                alt="Preview"
                                className="w-full h-auto max-w-xs mx-auto mt-4 rounded shadow-lg"
                            />
                        )}
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded outline-none flex items-center justify-center"
                            disabled={loading} 
                        >
                            {loading ? (
                          <Loading/>
                            ) : 'Create Event'}
                        </button>
                    </form>
                </div>
            );
        }
    }
}
