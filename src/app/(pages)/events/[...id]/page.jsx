'use client';

import { useState, useEffect } from 'react';
import Loading from "@/app/loading";
import { useUser } from "@/context/UserContext";
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function EventPage() {
    const { loadingMain, user } = useUser();
    const router = useRouter();
    const { id } = useParams(); 
    const [event, setEvent] = useState(null);
    const [loadingEvent, setLoadingEvent] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`/api/events/${id}`);
                if (response.data.success) {
                    setEvent(response.data.data);
                } else {
                    toast.error(response.data.message || 'Error fetching event');
                }
            } catch (error) {
                toast.error('Error fetching event');
            } finally {
                setLoadingEvent(false);
            }
        };

        if (id) {
            fetchEvent();
        }
    }, [id]);

    if (loadingMain || loadingEvent) {
        return <Loading />;
    }

    if (!user) {
        toast.error('Please Login First');
        router.replace('/login');
        return null;
    }

    if (!event) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
                <h1 className="text-3xl font-bold">Event Not Found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8 mt-20">
            <div className="flex flex-col md:flex-row bg-gray-800 rounded-lg shadow-md">
                <div className="w-full md:w-1/3">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover rounded-t-lg md:rounded-t-none md:rounded-l-lg"
                    />
                </div>
                <div className="p-6 flex-1">
                    <h1 className="text-3xl font-bold text-white mb-4">{event.title}</h1>
                    <p className="text-gray-400 mb-4">{event.description}</p>
                    <p className="text-gray-400 mb-2">
                        <span className="font-semibold text-white">Event Date: </span>
                        {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 mb-2">
                        <span className="font-semibold text-white">Registration: </span>
                        {new Date(event.registrationStart).toLocaleDateString()} - {new Date(event.registrationEnd).toLocaleDateString()}
                    </p>
                    <a href={event.driveLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 mt-4 inline-block">
                        View on Google Drive
                    </a>
                    <button
                        onClick={() => { router.push(`/events/join/${id}`)}} className="mt-6 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded block">
                        Participate
                    </button>
                </div>
            </div>
        </div>
    );
}
