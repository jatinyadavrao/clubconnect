import { dbConnect } from "@/utils/config/db";
import { User } from "@/utils/models/user.model";
import { NextResponse } from "next/server";


export async function GET(req){
try {
    await dbConnect();
    const users = await User.find({});
    return NextResponse.json({
        success:true,
        message:"All Users Fetched Successfully",
        data:users
    })
} catch (error) {
    return NextResponse.json({
        success: false,
        message: 'Error in Fetching Users',
        data:null
      });
}

}