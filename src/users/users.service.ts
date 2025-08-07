import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: users,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { id: id } });
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      throw new UnauthorizedException(`User with id ${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new UnauthorizedException(`User with id ${id} not found`);
    }
    return this.userRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByRole(role: 'user' | 'admin'): Promise<User[]> {
    return this.userRepository.find({ where: { role } });
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Update only provided fields
    Object.assign(user, updateProfileDto);
    return this.userRepository.save(user);
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    
    // Update password
    user.password = hashedNewPassword;
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }
}
