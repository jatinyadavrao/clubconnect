import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/config/db";
import { Notification } from "@/utils/models/notification.model";

export async function POST(req) {
  try {
    await dbConnect();

    const { userId, notificationId } = await req.json();

    if (!userId || !notificationId) {
      return NextResponse.json({
        success: false,
        message: "UserId and NotificationId are required",
      });
    }


    const userNotification = await Notification.findById(notificationId);
    
    if (!userNotification) {
      return NextResponse.json({
        success: false,
        message: "No notifications found",
      });
    }

    const user = userNotification.users.find((user) => user.user === userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found in the notification",
      });
    }

    user.seen = true;

    await userNotification.save();

    return NextResponse.json({
      success: true,
      message: "Notification seen successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error in watching notification",
    });
  }
}
