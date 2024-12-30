import { dbConnect } from "@/utils/config/db";
import { User } from "@/utils/models/user.model";

import { NextResponse } from "next/server";


export async function POST(req){
try {
    await dbConnect();
    const {userId,newRole} = await req.json();    
    console.log(userId,newRole);
    const updatedUser = await User.findByIdAndUpdate(userId,{position:newRole},{new:true});
    if(!updatedUser){
        return NextResponse.json({
            success:false,
            message:"User Not Found",
        })
    }
    prevUser.save()
    return NextResponse.json({
        success:true,
        message:"Role Updated Successfully Successfully",
    })
} catch (error) {
    return NextResponse.json({
        success: false,
        message: 'Error in Updating Role',
      });
}

}