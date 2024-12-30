import { v2 as cloudinary } from 'cloudinary';


export async function UploadCloudinary(file) {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
   try {
    
      const uploadResult = await cloudinary.uploader
       .upload(
          file , {
              folder:'ClubConnect'
           })
           return uploadResult;
        }
       catch(error) {
           console.log(error);
           return null
       };
    
};