import { dbConnect } from "@/utils/config/db";
import { Event } from "@/utils/models/event.model";
import { NextResponse } from "next/server";


export async function GET(req){
try {
    await dbConnect();
    const events = await Event.find({});
    return NextResponse.json({
        success:true,
        message:"All Events Fetched Successfully",
        data:events
    })
} catch (error) {
    return NextResponse.json({
        success: false,
        message: 'Error in Fetching Events',
        data:null
      });
}

}