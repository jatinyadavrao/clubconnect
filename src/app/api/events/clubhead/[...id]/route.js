import { dbConnect } from "@/utils/config/db";
import { Event } from "@/utils/models/event.model";
import mongoose from 'mongoose'; 
import { Submission } from "@/utils/models/submission.model";
import { User } from "@/utils/models/user.model";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id } = params;

        // Convert the string `id` to a MongoDB ObjectId
        const clubHeadId = new mongoose.Types.ObjectId(id.join(''));
        const events = await Event.find({ createdBy: clubHeadId })
            .populate({
                path: 'submissions',
                populate: [
                    { path: 'teamLeader', model: 'User' }
                ]
            }).exec();
        
        console.log(events);

        if (!events.length) {
            return NextResponse.json({
                success: false,
                message: 'No events found for this ClubHead',
                data: null,
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Events fetched successfully',
            data: events,
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({
            success: false,
            message: 'Error fetching events',
            data: null,
        });
    }
}
