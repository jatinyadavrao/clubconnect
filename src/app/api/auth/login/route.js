import { User } from '@/utils/models/user.model';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/utils/config/db';

export async function POST(req) {
  try {
    await dbConnect()
    const { email, password } = await req.json();
    const cookieStore = cookies();
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: "No Account Associated with this Email"
        ,data:null
      });
    }

    if (!existingUser.isVerified) {
      return NextResponse.json({
        success: false,
        message: "Email not Verified, Please Verify the Email first"
        ,data:null
      });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return NextResponse.json({
        success: false,
        message: "Password is Incorrect"
        ,data:null
      });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '3h' });

    cookieStore.set('token', token, {
      httpOnly: true,
     // secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(Date.now() + 3600000) 
    });
    existingUser.password = undefined
    return NextResponse.json({
      success: true,
      message: "Logged In Successfully",
      data:existingUser
    }, { status: 200 });
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json({
      success: false,
      message: "Error in login, please try again..."
      ,data:null
    });
  }
}
