import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/config/db";

import {Notification} from "@/utils/models/notification.model"; 

export async function POST(req) {
  try {
    await dbConnect();


    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "UserId is required",
      });
    }

  
   const userNotifications = await Notification.find({ "users.user": userId , "users.seen": false });


 if(!userNotifications){
        return NextResponse.json({
            success: true,
            message: "No notifications found",
            data:null,
        });
 }
    return NextResponse.json({
      success: true,
      message: "Notifications fetched successfully",
      data:userNotifications,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error in fetching notifications",
      data:null
    });
  }
}
