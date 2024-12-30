'use client';

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from 'axios'; 
import { toast } from 'react-hot-toast';
import Loading from "@/app/loading";
import { useUser } from "@/context/UserContext";
import { AiFillDelete } from 'react-icons/ai'; 


export default function JoinEvent() {
    const { loadingMain, user } = useUser(); 
    const [event, setEvent] = useState(null);
    const [loadingEvent, setLoadingEvent] = useState(true);
    const [joinEventLoading, setJoinEventLoading] = useState(false);
    const [participants, setParticipants] = useState([]);
    const router = useRouter();
    
    const { id } = useParams();

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

    const addParticipant = () => {
        setParticipants([...participants, ""]);
    };

    const handleParticipantChange = (index, email) => {
        const newParticipants = [...participants];
        newParticipants[index] = email;
        setParticipants(newParticipants);
    };

    const deleteParticipant = (index) => {
        const newParticipants = participants.filter((_, i) => i !== index);
        setParticipants(newParticipants);
    };

    const JoinEvent = async () => {
        try {
            setJoinEventLoading(true);
            for (let index = 0; index < participants.length; index++) {
                if (!participants[index].includes('@iiitu.ac.in')) {
                    toast.error(`Please enter a valid iiitu email for participant ${index + 1}`);
                    return; 
                }
            }
        
            const response = await axios.post(`/api/events/join-event`, {
                eventId: id,
                teamLeader: user._id,
                teamMembers: participants
            });

            if (response.data.success) {
                toast.success('Event joined successfully');
                router.push('/events');
            } else {
                toast.error(response.data.message || 'Error Joining Event');
            }
        } catch (error) {
            toast.error('Error Joining Event');
        }
        finally{
            setJoinEventLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-lg p-6 bg-gray-800 rounded-md shadow-lg">
                <h1 className="text-3xl font-bold mb-4 text-center text-indigo-400">Join Event</h1>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">Team Leader</label>
                    <input 
                        type="email" 
                        value={user.email} 
                        disabled={true} 
                        className="w-full mt-1 p-2 border border-gray-700 rounded-md bg-gray-700 text-gray-400"
                    />
                </div>
                
                {participants.map((participant, index) => (
                    <div key={index} className="mb-4 flex items-center space-x-3">
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-300">Participant {index + 1}</label>
                            <div className="flex justify-between items-center gap-3">
                            <input
                                type="email"
                                value={participant}
                                onChange={(e) => handleParticipantChange(index, e.target.value)}
                                placeholder="Enter participant email"
                                className="w-full mt-1 p-2 border border-gray-700 rounded-md bg-gray-700 text-gray-300"
                            />
                        
                        <AiFillDelete 
                            onClick={() => deleteParticipant(index)} 
                            className="text-red-600 hover:text-red-800 cursor-pointer" 
                            size={24}
                        /></div>
                        </div>
                    </div>
                ))}

                {event.maxMembers - 1 > participants.length && (
                    <button 
                        onClick={addParticipant} 
                        className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
                    >
                        Add Participant
                    </button>
                )}

                { participants.length >= event.minMembers-1 ? (
                    <button 
                        onClick={JoinEvent
                        } disabled={joinEventLoading}
                        className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
                    >
                       {joinEventLoading?<Loading/>:"Join Event"} 
                    </button>
                ) : (
                    <div className="mt-4">
                        <span className="block mb-2 text-red-600">* Please Add At least {event.minMembers - 1} Participants *</span>
                        <button 
                            disabled 
                            className="w-full py-2 bg-gray-600 text-gray-400 font-semibold rounded-md cursor-not-allowed"
                        >
                            Join Event
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
