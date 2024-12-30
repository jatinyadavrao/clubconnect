import { dbConnect } from "@/utils/config/db";
import { Event } from "@/utils/models/event.model";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id } = params;

        const event = await Event.findById(id);

        if (!event) {
            return NextResponse.json({
                success: false,
                message: 'Event not found',
                data: null,
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Event fetched successfully',
            data: event,
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        return NextResponse.json({
            success: false,
            message: 'Error fetching event',
            data: null,
        }, { status: 500 });
    }
}
