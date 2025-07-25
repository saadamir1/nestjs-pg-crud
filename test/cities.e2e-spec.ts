import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { City } from '../src/cities/entities/city.entity';
import { Repository } from 'typeorm';

describe('Cities (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let cityRepository: Repository<City>;
  let testCounter = 0;

  const generateUniqueName = (prefix: string) => {
    testCounter++;
    return `${prefix}_${Date.now()}_${testCounter}`;
  };

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

    // Get city repository for cleanup
    cityRepository = moduleFixture.get<Repository<City>>(
      getRepositoryToken(City),
    );

    // Clean up any existing test data
    try {
      await cityRepository.query(
        "DELETE FROM cities WHERE name LIKE '%TestCity%' OR name LIKE '%GetTestCity%' OR name LIKE '%UpdateTestCity%' OR name LIKE '%DeleteTestCity%' OR name LIKE '%DuplicateCity%'",
      );
    } catch (error) {
      console.log('Initial cleanup error:', error.message);
    }

    // Login to get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: 'admin',
      })
      .expect(201);

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    // Clean up test data
    try {
      await cityRepository.query(
        "DELETE FROM cities WHERE name LIKE '%TestCity%' OR name LIKE '%GetTestCity%' OR name LIKE '%UpdateTestCity%' OR name LIKE '%DeleteTestCity%' OR name LIKE '%DuplicateCity%'",
      );
    } catch (error) {
      console.log('Cleanup error:', error.message);
    }

    // Properly close the app and all connections
    if (app) {
      await app.close(); // ← This prevents worker process hanging
    }
  }, 30000); // ← 30 second timeout

  describe('/cities (POST)', () => {
    it('should create a new city', async () => {
      const uniqueName = generateUniqueName('TestCity');

      return request(app.getHttpServer())
        .post('/cities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: uniqueName,
          description: 'A test city',
          country: 'Test Country',
          active: true,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe(uniqueName);
          expect(res.body.country).toBe('Test Country');
          expect(res.body.id).toBeDefined();
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post('/cities')
        .send({
          name: generateUniqueName('UnauthorizedCity'),
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
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer()).get('/cities').expect(401);
    });
  });

  describe('/cities/:id (GET)', () => {
    let cityId: number;
    const uniqueName = generateUniqueName('GetTestCity');

    beforeAll(async () => {
      // Create a city for testing
      const response = await request(app.getHttpServer())
        .post('/cities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: uniqueName,
          description: 'City for GET test',
          country: 'Test Country',
        })
        .expect(201);

      cityId = response.body.id;
      expect(cityId).toBeDefined();
      expect(typeof cityId).toBe('number');
    });

    it('should return a city by id', () => {
      return request(app.getHttpServer())
        .get(`/cities/${cityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(cityId);
          expect(res.body.name).toBe(uniqueName);
        });
    });

    it('should return empty response for non-existent city', () => {
      return request(app.getHttpServer())
        .get('/cities/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({});
        });
    });
  });

  describe('/cities/:id (PATCH)', () => {
    let cityId: number;
    const uniqueName = generateUniqueName('UpdateTestCity');

    beforeAll(async () => {
      // Create a city for testing
      const response = await request(app.getHttpServer())
        .post('/cities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: uniqueName,
          description: 'City for UPDATE test',
          country: 'Test Country',
        })
        .expect(201);

      cityId = response.body.id;
      expect(cityId).toBeDefined();
    });

    it('should update a city', () => {
      const updatedName = generateUniqueName('UpdatedCity');

      return request(app.getHttpServer())
        .patch(`/cities/${cityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: updatedName,
          description: 'Updated description',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updatedName);
          expect(res.body.description).toBe('Updated description');
        });
    });

    it('should return 404 for non-existent city', () => {
      return request(app.getHttpServer())
        .patch('/cities/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: generateUniqueName('NonExistentUpdate'),
        })
        .expect(404);
    });
  });

  describe('/cities/:id (DELETE)', () => {
    let cityId: number;
    const uniqueName = generateUniqueName('DeleteTestCity');

    beforeAll(async () => {
      // Create a city for testing
      const response = await request(app.getHttpServer())
        .post('/cities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: uniqueName,
          description: 'City for DELETE test',
          country: 'Test Country',
        })
        .expect(201);

      cityId = response.body.id;
      expect(cityId).toBeDefined();
    });

    it('should soft delete a city', () => {
      return request(app.getHttpServer())
        .delete(`/cities/${cityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should return 404 for non-existent city', () => {
      return request(app.getHttpServer())
        .delete('/cities/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
