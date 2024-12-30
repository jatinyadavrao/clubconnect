import { NextResponse } from "next/server";
import { dbConnect } from '@/utils/config/db';
import { Event } from "@/utils/models/event.model";


export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json()
    console.log(body)
    const event = await Event.findById(body.eventId);
    console.log('yaaha aya 1')
    if (!event) {
      return NextResponse.json({
        success: false,
        message: 'Event Not Found'
      });
    }
    console.log('yaaha aya2')
    console.log(event)
    event.feedbackFormSent = true;
    event.save();
    return NextResponse.json({
      success: true,
      message: 'Feedback Form Sent Successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error in Sending Feedback Form'
    });
  }
}
