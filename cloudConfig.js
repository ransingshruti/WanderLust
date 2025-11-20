require('dotenv').config();

const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

console.log("Current timestamp:", Math.floor(Date.now() / 1000));


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "WanderLust_DEV",
      allowed_formats: ["jpeg", "png", "jpg"]
    }
  }
});


module.exports={
    cloudinary,
    storage
}