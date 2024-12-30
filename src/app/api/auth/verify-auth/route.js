import { User } from '@/utils/models/user.model';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export  async function GET(req) {

    const cookieStore = cookies();
    const token = cookieStore.get("token")
  
  if (!token) {
    return NextResponse.json({
      success: false,
      message: 'Not authenticated',
      data:null
    });
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const user  = await User.findById(decoded.id).select("-password")
    if(!user){
        return NextResponse.json({
            success:false,
            message:"Not Authenticated",
            data:null
        })
    }

    return NextResponse.json({
      success: true,
      message:"User is Authenticated",
      data:user
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Invalid token',
      data:null
    });
  }
}
