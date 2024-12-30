import { dbConnect } from "@/utils/config/db";
import { Event } from "@/utils/models/event.model";
import { Submission } from "@/utils/models/submission.model";
import { NextResponse } from "next/server";

export async function POST(req) {
    try{
        await dbConnect();
        const {eventId, teamLeader,teamMembers} = await req.json();
        const existingResponse = await Submission.findOne({eventId, teamLeader}); 
        if(existingResponse){
            return NextResponse.json({
                success:false,
                message:"You have already joined this event"
            })
        }
        const newSubmission = new Submission({
            eventId,
            teamLeader,
            teamMembers
        });
        await newSubmission.save();
        await Event.findByIdAndUpdate(eventId, {
            $push: {submissions: newSubmission._id}})
        return NextResponse.json({
            success:true,
            message:"Event Joined Successfully"
        })
    }catch(error){
        return NextResponse.json({
            success:false,
            message:"Error in Joining Event"
        })
           
        
    }
}