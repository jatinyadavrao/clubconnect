
import { sendMail } from "@/utils/Mail/nodemailerConfig";
import { User } from "@/utils/models/user.model";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { dbConnect } from "@/utils/config/db";

export async function POST(req) {
  try {
    await dbConnect()

    const { email } =  await req.json();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email });
    }

    if (user.isVerified) {
      return NextResponse.json({
        success: false,
        message: "User already verified"
      });
    }

    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await User.findOneAndUpdate({ email }, { verificationToken: token, tokenExpiry: Date.now() + 3600000 });

    await sendMail(email, token);

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("Error in sending verification email:", error);
    return NextResponse.json({
      success: false,
      message: "Some error occurred in sending verification email"
    }, { status: 500 });
  }
}
