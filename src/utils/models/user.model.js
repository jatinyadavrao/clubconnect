import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
 
  },
  isVerified:{
    type:Boolean,
    default:false
  },

  position: {
    type: String,
    enum: ['Student', 'ClubHead','Admin'],
    default: 'Student',
  },
  verificationToken: {
    type: String,
 
  },
  tokenExpiry: {
    type: Date,
  },
  resetPasswordToken:{
    type:String,
  }
}, { timestamps: true });

export const User =  mongoose.models.User || mongoose.model('User', userSchema);
