import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { UsersService } from '../users/users.service';
import { CitiesService } from '../cities/cities.service';

@Injectable()
export class UploadService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private usersService: UsersService,
    private citiesService: CitiesService,
  ) {}

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

  async uploadProfilePicture(userId: number, file: Express.Multer.File): Promise<string> {
    // Check if user exists
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Upload to Cloudinary
    const url = await this.uploadImage(file, 'avatars');

    // Update user profile picture
    await this.usersService.update(userId, { profilePicture: url });

    return url;
  }

  async uploadCityImage(cityId: number, file: Express.Multer.File): Promise<string> {
    // Check if city exists
    const city = await this.citiesService.findOne(cityId);
    if (!city) {
      throw new NotFoundException('City not found');
    }

    // Upload to Cloudinary
    const url = await this.uploadImage(file, 'cities');

    // Update city image
    await this.citiesService.update(cityId, { imageUrl: url });

    return url;
  }
}
