'use client';

import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function ManageFeedback() {
    const { loadingMain, user } = useUser();
    const router = useRouter();
    const [feedbackData, setFeedbackData] = useState([]);
    const [loadingFeedback, setLoadingFeedback] = useState(true);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get(`/api/events/clubhead/manage-feedback/${user._id}`);
                if (response.data.success) {
                    setFeedbackData(response.data.data);
                    // Calculate average rating for each event if feedbacks exist
                    response.data.data.forEach((event) => {
                        if (event.feedbacks?.length > 0) {
                            const averageRating = event.feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / event.feedbacks.length;
                            setRating(averageRating);  // Update state with the average rating for the event
                        }
                    });
                } else {
                    console.log(error.message,error)
                    // toast.error(response.data.message || 'Error fetching feedback data');
                }
            } catch (error) {
                console.log(error.message,error)
                // toast.error('Error fetching feedback data');
            } finally {
                setLoadingFeedback(false);
            }
        };

        fetchFeedback();
    }, [user]);

    if (loadingMain || loadingFeedback) {
        return <Loading />;
    }

    if (!user && (user?.role !== 'ClubHead' || user?.role !== 'Admin')) {
        toast.error('Unauthorized Access');
        router.replace('/login');
        return null;
    }

    return (
        <div className="bg-gray-900 min-h-screen p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Manage Feedback</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbackData&&feedbackData?.length>0&&feedbackData.map((event) => (
                    <div key={event._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-white mb-4">{event.title}</h2>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-300">Total Feedbacks: {event.feedbacks.length}</span>
                            <span className="text-gray-300">Average Rating: {rating}</span>
                        </div>
                        <div className="space-y-2">
                            {event.feedbacks.map((feedback, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-700 p-3 rounded-md shadow-sm text-white"
                                >
                                    <p className="mb-2">
                                        <strong>User:</strong> {feedback.email}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Rating:</strong> {feedback.rating}
                                    </p>
                                    <p>
                                        <strong>Feedback:</strong> {feedback.feedbackText}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
