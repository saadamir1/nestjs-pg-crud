import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async generateTokens(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, {
      secret: 'refresh-secret',
      expiresIn: '7d',
    });
    return { access_token, refresh_token };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, { refreshToken: hashed });
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Wrong password');

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token); // Store hashed refresh token in the databaseS

    return tokens;
  }

  async refresh(incomingRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(incomingRefreshToken, {
        secret: 'refresh-secret', // same secret used for refresh token generation
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user?.refreshToken) {
        throw new ForbiddenException('No refresh token stored');
      }

      const isMatch = await bcrypt.compare(
        incomingRefreshToken,
        user.refreshToken,
      );
      if (!isMatch) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);
      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return tokens;
    } catch (err) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }
}
