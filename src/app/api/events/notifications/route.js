import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/config/db";
import {Submission} from "@/utils/models/submission.model"; 
import {Notification} from "@/utils/models/notification.model"; 

export async function POST(req) {
  try {
    await dbConnect();


    const { eventId, message } = await req.json();

    if (!eventId || !message) {
      return NextResponse.json({
        success: false,
        message: "Event ID and message are required",
      });
    }

  
    const submissions = await Submission.find({ eventId }, "teamLeader");
    console.log(submissions);
    if (!submissions || submissions.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No team leaders found for the specified event",
      });
    }


    const users = submissions.map(submission => ({
      user: submission.teamLeader,
      seen: false, 
    }));

   
    const notification = new Notification({
      eventID: eventId,
      message,
      users,
    });


    await notification.save();
   // console.log(notification.users[0].seen)
    return NextResponse.json({
      success: true,
      message: "Notification created and sent successfully",
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json({
      success: false,
      message: "Error in creating notification",
    });
  }
}
