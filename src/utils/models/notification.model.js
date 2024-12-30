import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
   eventID:{
        type:String,
   },
    message: {
      type: String,
      required: true,
    },
    users:[{
     user:{type:String,required:true},
     seen:{
        type:Boolean,
        required:true,
     },
    }]
    
  },
  { timestamps: true }
);

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
