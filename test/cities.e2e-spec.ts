import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';

describe('Cities (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    
    await app.init();

    // Login to get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password',
      })
      .expect(201);

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/cities (POST)', () => {
    it('should create a new city', () => {
      return request(app.getHttpServer())
        .post('/cities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test City',
          description: 'A test city',
          country: 'Test Country',
          active: true,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe('Test City');
          expect(res.body.country).toBe('Test Country');
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post('/cities')
        .send({
          name: 'Test City',
          description: 'A test city',
        })
        .expect(401);
    });

    it('should fail with invalid data', () => {
      return request(app.getHttpServer())
        .post('/cities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'A test city without name',
        })
        .expect(400);
    });
  });

  describe('/cities (GET)', () => {
    it('should return paginated cities', () => {
      return request(app.getHttpServer())
        .get('/cities?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('lastPage');
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .get('/cities')
        .expect(401);
    });
  });

  describe('/cities/:id (GET)', () => {
    let cityId: number;

    beforeAll(async () => {
      // Create a city for testing
      const response = await request(app.getHttpServer())
        .post('/cities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Get Test City',
          description: 'City for GET test',
          country: 'Test Country',
        });
      cityId = response.body.id;
    });

    it('should return a city by id', () => {
      return request(app.getHttpServer())
        .get(`/cities/${cityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(cityId);
          expect(res.body.name).toBe('Get Test City');
        });
    });
  });

  describe('/cities/:id (PATCH)', () => {
    let cityId: number;

    beforeAll(async () => {
      // Create a city for testing
      const response = await request(app.getHttpServer())
        .post('/cities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Update Test City',
          description: 'City for UPDATE test',
          country: 'Test Country',
        });
      cityId = response.body.id;
    });

    it('should update a city', () => {
      return request(app.getHttpServer())
        .patch(`/cities/${cityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated City Name',
          description: 'Updated description',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated City Name');
          expect(res.body.description).toBe('Updated description');
        });
    });
  });

  describe('/cities/:id (DELETE)', () => {
    let cityId: number;

    beforeAll(async () => {
      // Create a city for testing
      const response = await request(app.getHttpServer())
        .post('/cities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Delete Test City',
          description: 'City for DELETE test',
          country: 'Test Country',
        });
      cityId = response.body.id;
    });

    it('should soft delete a city', () => {
      return request(app.getHttpServer())
        .delete(`/cities/${cityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});