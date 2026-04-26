import * as dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

console.log('Cloudinary config:', {
  name: process.env.CLOUDINARY_NAME,
  key: process.env.CLOUDINARY_API_KEY ? '***' : 'Not set',
  secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'Not set',
});

cloudinary.uploader.upload('test.pdf', (err, res) => {
  if (err) console.error('Upload error:', err);
  else console.log('Upload success:', res?.secure_url);
});