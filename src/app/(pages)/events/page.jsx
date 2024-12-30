'use client';
import { useState, useEffect } from 'react';
import Loading from "@/app/loading";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

export default function Events() {
    const { loadingMain, user } = useUser();
    const router = useRouter();
    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/events/all-events');
                if (response.data.success) {
                    setEvents(response.data.data);
                } else {
                    toast.error(response.data.message || 'Error fetching events');
                }
            } catch (error) {
                toast.error('Error fetching events');
            } finally {
                setLoadingEvents(false);
            }
        };

        fetchEvents();
    }, []);

    if (loadingMain || loadingEvents) {
        return <Loading />;
    } else {
        if (!user) {
            toast.error('Please Login First');
            router.replace('/login');
            return null;
        } else {
            return (
                <div className="min-h-screen bg-gray-900 p-8">
                    <h1 className="text-3xl font-bold text-white mb-6">Events</h1>
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.length > 0 ? events.map((event) => (
                                <div key={event._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
                                    <p className="text-gray-400 mb-2">{event.description.slice(0,40)}...</p>
                                    <p className="text-gray-400">
                                        <span className="font-semibold text-white">Event Date: </span>
                                        {new Date(event.eventDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-400">
                                        <span className="font-semibold text-white">Registration: </span>
                                        {new Date(event.registrationStart).toLocaleDateString()} - {new Date(event.registrationEnd).toLocaleDateString()}
                                    </p>
                                    <a href={event.driveLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 mt-4 inline-block">
                                        View on Google Drive
                                    </a>
                                    <button
                                        onClick={() => router.push(`/events/${event._id}`)}
                                        className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded block text-center"
                                    >
                                        Participate
                                    </button>
                                </div>
                            )) : <div className='flex justify-center items-center text-white font-bold w-full h-full'>No Events Found</div>}
                        </div>
                    </div>
                </div>
            );
        }
    }
}
