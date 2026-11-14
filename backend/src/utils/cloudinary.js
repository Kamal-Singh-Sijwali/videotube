import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET 
    });

const uploadOncloudinary = async(localFilePath) =>{
    try {
        if(!localFilePath) return null
         const response =await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("File uploaded successfully")
        fs.unlinkSync(localFilePath)
        // console.log("file upload response.url",response.url)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as operation failed 
        return null;
    }

}

export {uploadOncloudinary}

// const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });