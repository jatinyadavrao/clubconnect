import { dbConnect } from "@/utils/config/db";
import { Event } from "@/utils/models/event.model";
import { Feedback } from "@/utils/models/feedback.model";
import { NextResponse } from "next/server";

export async function POST(req) {
    try{
        await dbConnect();
        const body = await req.json();
        const existingResponse = await Feedback.findOne({eventId:body.eventId,userId:body.userId,email:body.email}); 
        if(existingResponse){
            return NextResponse.json({
                success:false,
                message:"You have already submitted the feedback"
            })
        }
        const newFeedback = new Feedback({
            eventId:body.eventId,
            userId:body.userId,
            email:body.email,
            feedbackText:body.feedbackText,
            rating:body.rating
        });
        await newFeedback.save();
        await Event.findByIdAndUpdate(body.eventId, {
            $push: {feedbacks: newFeedback._id}})
        return NextResponse.json({
            success:true,
            message:"Feedback Submitted Successfully"
        })
    }catch(error){
        return NextResponse.json({
            success:false,
            message:"Error in Submitting Feedback"
        })
           
        
    }
}