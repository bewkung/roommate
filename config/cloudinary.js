const cloudinary = require("cloudinary").v2;

require("dotenv").config()
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
    api_key: process.env.CLOUDINARY_CLOUDAPI, 
    api_secret:process.env.CLOUDINARY_CLOUDAPI_SECRET })
module.exports = cloudinary