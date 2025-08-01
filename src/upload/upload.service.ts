import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryService } from '../common/services/cloudinary.service';

@Injectable()
export class UploadService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'images',
  ): Promise<string> {
    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only image files are allowed (JPEG, PNG, GIF, WebP)',
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    return await this.cloudinaryService.uploadFile(file, folder);
  }

  async deleteImage(fileUrl: string): Promise<void> {
    return await this.cloudinaryService.deleteFile(fileUrl);
  }
}
