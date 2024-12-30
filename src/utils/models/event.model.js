import mongoose, { Schema } from 'mongoose';

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    maxMembers: {
        type: Number,
        required: true
    },
    minMembers: {
        type: Number,
        required: true
    },
    driveLink: {
        type: String,
        required: true
    },
    registrationStart: {
        type: Date,
        required: true
    },
    registrationEnd: {
        type: Date,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        required: false 
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    submissions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Submission'
        }
    ],
    feedbacks:[
        {type:Schema.Types.ObjectId, ref:'Feedback'}
    ],
    feedbackFormSent:{
        type:Boolean,
    }
});


export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
