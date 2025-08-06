import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';

describe('Email Verification (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    await app.init();
  });

  afterEach(async () => {
    if (userRepository) {
      await userRepository.clear();
    }
    if (app) {
      await app.close();
    }
  });

  describe('/auth/send-verification (POST)', () => {
    it('should send verification email for existing user', async () => {
      // Create unverified user with proper password hash
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('password', 10);
      
      const user = userRepository.create({
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: false,
        role: 'user',
      });
      await userRepository.save(user);

      return request(app.getHttpServer())
        .post('/auth/send-verification')
        .send({ email: 'test@example.com' })
        .expect(201)
        .expect((res) => {
          expect(res.body.message).toBe('Verification email sent');
        });
    });

    it('should return generic message for non-existent user', async () => {
      return request(app.getHttpServer())
        .post('/auth/send-verification')
        .send({ email: 'nonexistent@example.com' })
        .expect(201)
        .expect((res) => {
          expect(res.body.message).toBe('If email exists, verification link has been sent');
        });
    });
  });

  describe('/auth/verify-email (POST)', () => {
    it('should verify email with valid token', async () => {
      // Create user with verification token
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('password', 10);
      
      const user = userRepository.create({
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: false,
        emailVerificationToken: 'valid-token',
        emailVerificationTokenExpires: new Date(Date.now() + 60000),
        role: 'user',
      });
      await userRepository.save(user);

      return request(app.getHttpServer())
        .post('/auth/verify-email')
        .send({ token: 'valid-token' })
        .expect(201)
        .expect((res) => {
          expect(res.body.message).toBe('Email verified successfully');
        });
    });

    it('should reject invalid token', async () => {
      return request(app.getHttpServer())
        .post('/auth/verify-email')
        .send({ token: 'invalid-token' })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe('Invalid or expired verification token');
        });
    });
  });

  describe('/auth/login with email verification', () => {
    it('should block login for unverified email', async () => {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('password', 10);
      
      const user = userRepository.create({
        email: 'unverified@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: false,
        role: 'user',
      });
      await userRepository.save(user);

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'unverified@example.com', password: 'password' })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Please verify your email before logging in');
        });
    });
  });
});