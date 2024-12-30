import { dbConnect } from "@/utils/config/db";
import { Event } from "@/utils/models/event.model";
import { Submission } from "@/utils/models/submission.model";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id } = params;

     
        const event = await Event.findByIdAndDelete(id);
        await Submission.findByIdAndDelete({ eventId: id });
        console.log(event);
        if (!event) {
            return NextResponse.json({
                success: false,
                message: 'Event not found',
                data: null,
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Event deleted successfully',
            data: event,
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({
            success: false,
            message: 'Error deleting event',
            data: null,
        });
    }
}