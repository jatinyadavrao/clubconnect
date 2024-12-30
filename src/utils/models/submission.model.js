import mongoose from "mongoose";


const submissionSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Event',
        required: true
    },
    teamLeader:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required: true
    },
    teamMembers: [
        {
            type: String,
            required: true
        }
    ],
   
}

, { timestamps: true});

export const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);

