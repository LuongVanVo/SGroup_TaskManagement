import dotenv from 'dotenv';
dotenv.config()
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// upload image to cloudinary
export const uploadImage = async (filePath) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: 'subboards', // lưu ảnh vào thư mục subboards, chỉ thêm vào đường dẫn
            resource_type: 'image' // cho biết loại tài nguyên là hình ảnh
        })
         console.log(`File path: ${filePath} uploaded to Cloudinary`);
    
        console.log('Image uploaded to Cloudinary:', uploadResult.secure_url);
        return uploadResult.secure_url; // trả về URL của ảnh đã tải lên
    } catch (error) {
        throw new Error('Error uploading image to Cloudinary: ' + error.message);
    }
}