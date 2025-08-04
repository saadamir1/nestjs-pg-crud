import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'auto',
            transformation: [
              { width: 1000, height: 1000, crop: 'limit' },
              { quality: 'auto' },
              { format: 'auto' }, // Auto-convert to best format (WebP, AVIF)
              { fetch_format: 'auto' }, // Serve best format based on browser
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result && result.secure_url) {
              resolve(result.secure_url);
            } else {
              reject(
                new Error('Upload failed: No result returned from Cloudinary.'),
              );
            }
          },
        )
        .end(file.buffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
}
