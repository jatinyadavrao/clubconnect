import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { User } from "@/utils/models/user.model";
import bcrypt from 'bcrypt';
import { dbConnect } from "@/utils/config/db";

export async function POST(req) {
  try {
    dbConnect()
    const { token, password } = await req.json();

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "No Token Found"
      });
    }

    let data;
    try {
      data = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: "Invalid or Expired Token, Please Try Again.."
      });
    }

    const existingUser = await User.findOne({ email: data.email });

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: "No User Exists with this Email"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    existingUser.password = hashedPassword;
    existingUser.resetPasswordToken = undefined;

    await existingUser.save();

    return NextResponse.json({
      success: true,
      message: "Password Changed Successfully"
    }, { status: 200 });
  } catch (error) {
    
    return NextResponse.json({
      success: false,
      message: "Error in Resetting Password, Please Try Again"
    });
  }
}
