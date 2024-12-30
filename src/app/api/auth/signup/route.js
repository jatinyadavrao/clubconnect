import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { User } from "@/utils/models/user.model";
import bcrypt from 'bcrypt';
import { dbConnect } from "@/utils/config/db";

export async function POST(req) {
  try {
    dbConnect()
    const { token, username, password } = await req.json();

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
        message: "Invalid or Expired Token"
      });
    }

    const existingUser = await User.findOne({ email: data.email });

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: "No Such User Exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    existingUser.username = username;
    existingUser.password = hashedPassword;
    existingUser.verificationToken = undefined;
    existingUser.tokenExpiry = undefined;
    existingUser.isVerified = true;
    await existingUser.save();

    return NextResponse.json({
      success: true,
      message: "User Registered Successfully"
    }, { status: 200 });
  } catch (error) {
    console.error("Error in creating user:", error);
    return NextResponse.json({
      success: false,
      message: "Error in Creating User"
    }, { status: 500 });
  }
}
