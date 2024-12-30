import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { dbConnect } from '@/utils/config/db';
import { UploadCloudinary } from "@/utils/config/CloudinaryUpload";
import { Event } from "@/utils/models/event.model";
import { v4 as uuidv4 } from 'uuid'; 

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const maxMembers = formData.get('maxMembers');
    const minMembers = formData.get('minMembers');
    const driveLink = formData.get('driveLink');
    const registrationStart = formData.get('registrationStart');
    const registrationEnd = formData.get('registrationEnd');
    const eventDate = formData.get('eventDate');
    const id = formData.get('id')
    const poster = formData.get('poster');
    let imageUrl = '';

    if (poster) {

      const uniqueFilename = `${uuidv4()}-${poster.name}`;
      const uploadsPath = path.join(process.cwd(), 'public', 'uploads', uniqueFilename);



      const buffer = Buffer.from(await poster.arrayBuffer());
      await fs.promises.writeFile(uploadsPath, buffer);


      const result = await UploadCloudinary(uploadsPath);
      if (!result) {
        return NextResponse.json({
          success: false,
          message: "Error in Uploading File"
        });
      }
      imageUrl = result.secure_url;

      await fs.promises.unlink(uploadsPath);
    }

    const newEvent = new Event({
      title,
      description,
      maxMembers,
      minMembers,
      driveLink,
      registrationStart,
      registrationEnd,
      eventDate,
      image: imageUrl,
      createdBy: id,
      feedbackFormSent: false,
    });

    await newEvent.save();

    return NextResponse.json({
      success: true,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Error in Creating Event:', error);
    return NextResponse.json({
      success: false,
      message: 'Error in Creating Event'
    });
  }
}
