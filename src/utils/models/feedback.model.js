import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
email: {
      type: String,
      required: true,
    },
    feedbackText: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    }
  },
  { timestamps: true }
);

export const Feedback =  mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
