import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("token");

        if (!token) {
            return NextResponse.json({
                success: false,
                message: "You are already logged out, try reloading...",
            });
        }

        cookieStore.set("token", "", { expires: new Date(0) });

        return NextResponse.json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error in logging out",
        });
    }
}
