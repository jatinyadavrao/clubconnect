
import { sendMailForgotPass } from "@/utils/Mail/nodemailerConfig";
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
        return NextResponse.json({
            success: false,
            message: "No Account With this Email"
          })
    }

    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await User.findOneAndUpdate({ email }, { resetPasswordToken: token });

    await sendMailForgotPass(email, token);

    return NextResponse.json({
      success: true,
      message: "Email to Reset Your Password is Sent Successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("Error in sending Email:", error);
    return NextResponse.json({
      success: false,
      message: "Some error occurred in sending Email"
    }, { status: 500 });
  }
}
