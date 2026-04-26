import cloudinary from '../config/cloudinary.config';import { Readable } from 'stream';
import { Express } from 'express';

export const uploadFileToCloudinary = async (
  file: Express.Multer.File,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'resumes',
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed: no result'));
        resolve(result.secure_url);
      },
    );

    Readable.from(file.buffer).pipe(stream);
  });
};