'use client';
import { useState, useEffect } from 'react';
import Loading from "@/app/loading";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { AiFillStar } from 'react-icons/ai';

export default function Events() {
    const { loadingMain, user } = useUser();
    const router = useRouter();
    const [feedbackForms, setFeedbackForms] = useState([]);
    const [loadingFeedbackForms, setLoadingEvents] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user) return; // Wait for user context to initialize
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/events/feedbackRoute');
                console.log('API Response:', response.data);

                if (response.data.success) {
                    const eligibleForms = response.data.data.filter(event =>
                        event.submissions.some(
                            submission =>
                                submission.teamLeader === user.email ||
                                (submission.teamMembers.includes(user._id) &&
                                 !event.feedbacks.some(fb => fb.userId === user._id))
                        )
                    );
                    setFeedbackForms(eligibleForms);
                } else {
                    toast.error(response.data.message || 'Error fetching feedback forms');
                }
            } catch (error) {
                console.error('Fetch Error:', error);
                toast.error('Error fetching feedback forms');
            } finally {
                setLoadingEvents(false);
            }
        };

        fetchEvents();
    }, [user]);

    const handleSubmitFeedback = async () => {
        if (!rating || !feedbackText) {
            toast.error('Please provide a rating and feedback text');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/events/feedbackRoute/submit', {
                eventId: selectedEvent._id,
                userId: user._id,
                email: user.email,
                rating,
                feedbackText,
            });

            if (response.data.success) {
                toast.success('Feedback submitted successfully');
                setFeedbackForms(feedbackForms.filter(event => event._id !== selectedEvent._id));
                setShowPopup(false);
                setFeedbackText('');
                setRating(0);
            } else {
                toast.error(response.data.message || 'Error submitting feedback');
            }
        } catch (error) {
            console.error('Submit Error:', error);
            toast.error('Error submitting feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingMain || loadingFeedbackForms) {
        return <Loading />;
    }

    if (!user) {
        toast.error('Please Login First');
        router.replace('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Feedback Forms</h1>
            {feedbackForms.length === 0 ? (
                <p className="text-white">No feedback forms available at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feedbackForms.map((feedbackForm) => (
                        <div key={feedbackForm._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                            <img
                                src={feedbackForm.image || '/placeholder.jpg'}
                                alt={feedbackForm.title}
                                className="w-full h-40 object-cover rounded-md mb-4"
                            />
                            <h2 className="text-xl font-semibold text-white mb-4">{feedbackForm.title}</h2>
                            <button
                                onClick={() => {
                                    setSelectedEvent(feedbackForm);
                                    setShowPopup(true);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                            >
                                Submit Feedback
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showPopup && selectedEvent && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-white mb-4">Submit Feedback</h2>
                        <div className="flex items-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <AiFillStar
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`cursor-pointer text-2xl ${
                                        star <= rating ? 'text-yellow-500' : 'text-gray-500'
                                    }`}
                                />
                            ))}
                        </div>
                        <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Write your feedback..."
                            className="w-full p-2 rounded-lg bg-gray-700 text-white mb-4"
                            rows="4"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={handleSubmitFeedback}
                                disabled={isSubmitting}
                                className={`py-2 px-4 rounded-lg ${
                                    isSubmitting
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
