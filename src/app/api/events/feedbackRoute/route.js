import { NextResponse } from "next/server";
import { dbConnect } from '@/utils/config/db';
import { Event } from "@/utils/models/event.model";
import { Feedback } from "@/utils/models/feedback.model";
export async function GET(req) {
  try {
    await dbConnect();
    console.log('a')
    const event = await Event.find({feedbackFormSent:true}).populate('feedbacks').populate('submissions');
    console.log('b')
    if (!event) {
      return NextResponse.json({
        success: false,
        message: 'No Feedback Forms found'
      });
    }console.log('c')
    console.log(event)
    return NextResponse.json({
      success: true,
      message: 'Feedback Forms Fetched Successfully',
      data:event
    });
  } catch (error) {
    console.log(error.message,error)
    return NextResponse.json({
      success: false,
      message: 'Error in Fetching Feedback Form'
    });
  }
}
