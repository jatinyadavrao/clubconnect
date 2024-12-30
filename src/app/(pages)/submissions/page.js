'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import Loading from '@/app/loading';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
export default function SubmissionsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [notificationText, setNotificationText] = useState('');

  useEffect(() => {

    if (user?.position === 'ClubHead' || user?.position === 'Admin') {
      fetchEvents();
    } else {
      router.replace('/login');
    }
  }, [user]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/events/clubhead/${user._id}`);
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events', error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedEvent(null);
  };

  const openFeedbackModal = (event) => {
    setSelectedEvent(event);
    setShowFeedbackModal(true);
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedEvent(null);
  };

  const openNotificationModal = (event) => {
    setSelectedEvent(event);
    setShowNotificationModal(true);
  }
  const closeNotificationModal = () => {
    setShowNotificationModal(false);
    setSelectedEvent(null);
  }
  const handleDeleteEvent = async () => {
    try {
      await axios.get(`/api/events/clubhead/delete-event/${selectedEvent._id}`);
      setEvents(events.filter((event) => event._id !== selectedEvent._id));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const handleSendFeedbackForm = async () => {
    try {
      await axios.post('/api/events/clubhead/send-feedback', {
        eventId: selectedEvent._id,
      });
      alert('Feedback form sent to all participants.');
      closeFeedbackModal();
    } catch (error) {
      console.error('Error sending feedback form:', error);
      alert('Failed to send feedback form. Please try again.');
    }
  };
  const handleSendNotification = async () => {
    try {
      const res = await axios.post('/api/events/notifications', {
        eventId: selectedEvent._id,
        message: notificationText
      });
      if(res.data.success){
        toast.success('Notification sent successfully');
        closeNotificationModal();}

    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 mt-20">
      <h1 className="text-4xl font-bold text-center mb-8 text-[#97baff]">Event Submissions</h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events?.map((event) => (
            <div
              key={event._id}
              className="bg-gray-800 shadow-lg rounded-lg overflow-hidden transition duration-300 hover:scale-105"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-gray-100">{event.title}</h2>
                <p className="text-gray-300 mb-4">
                  <span className="font-semibold">Event Date:</span> {new Date(event.eventDate).toLocaleDateString()}
                </p>

                {event.submissions.length > 0 ? (
                  <>
                    <h3 className="text-xl font-semibold text-gray-200 mb-3">Submissions</h3>
                    {event.submissions.map((submission) => (
                      <div key={submission._id} className="bg-gray-700 p-4 rounded-lg mb-4">
                        <p className="text-gray-100">
                          <span className="font-semibold">Team Leader:</span> {submission.teamLeader?.email}
                        </p>
                        <p className="text-gray-100">
                          <span className="font-semibold">Team Members:</span>
                          <ul className="list-disc list-inside">
                            {submission.teamMembers.map((member, index) => (
                              <li key={index}>{member}</li>
                            ))}
                          </ul>
                        </p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-gray-400 italic">No submissions yet.</p>
                )}

                {/* Delete Button */}
                <button
                  onClick={() => openDeleteModal(event)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition duration-300"
                >
                  Delete Event
                </button>

                {/* Feedback Button */}
                <button
                  onClick={() => openFeedbackModal(event)}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded ml-1 hover:bg-green-500 transition duration-300"
                >
                  Send Feedback Form
                </button>
                <button onClick={()=>openNotificationModal(event)} className="mt-4 bg-green-600 text-white px-4 py-2 rounded ml-1 hover:bg-green-500 transition duration-300">Send Custom Notification</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Confirm Deletion</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <strong>{selectedEvent.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeleteEvent}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-500 transition duration-300"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Confirmation Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Send Feedback Form</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to send the feedback form to all participants of <strong>{selectedEvent.title}</strong>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSendFeedbackForm}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition duration-300"
              >
                Yes, Send
              </button>
              <button
                onClick={closeFeedbackModal}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
        {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Send Notification for <strong>{selectedEvent.title}</strong></h2>
            <p className="text-gray-300 mb-6">
              <input type="text" className='p-2 w-[100%] text-black' placeholder='Enter the Notification Text' value={notificationText} onChange={(e)=>{setNotificationText(e.target.value)}}/>
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSendNotification}
                className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition duration-300"
              >
                Yes,Send
              </button>
              <button
                onClick={closeNotificationModal}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
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
