import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from './cities.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

describe('CitiesService', () => {
  let service: CitiesService;
  let repo: Repository<City>;

  const mockCity = {
    id: 1,
    name: 'Lahore',
    description: 'City of gardens',
    active: true,
    country: 'Pakistan',
  };

  const mockCities = [mockCity, { ...mockCity, id: 2, name: 'Karachi' }];

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    softRemove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        { provide: getRepositoryToken(City), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
    repo = module.get<Repository<City>>(getRepositoryToken(City));
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new city', async () => {
      const createCityDto: CreateCityDto = {
        name: 'Islamabad',
        description: 'Capital city',
        country: 'Pakistan',
      };

      mockRepo.create.mockReturnValue(mockCity);
      mockRepo.save.mockResolvedValue(mockCity);

      const result = await service.create(createCityDto);

      expect(mockRepo.create).toHaveBeenCalledWith(createCityDto);
      expect(mockRepo.save).toHaveBeenCalledWith(mockCity);
      expect(result).toEqual(mockCity);
    });
  });

  describe('findAll', () => {
    it('should return paginated cities', async () => {
      mockRepo.findAndCount.mockResolvedValue([mockCities, mockCities.length]);

      const result = await service.findAll(1, 10);

      expect(mockRepo.findAndCount).toHaveBeenCalledWith({
        where: {},
        take: 10,
        skip: 0,
        withDeleted: false,
      });
      expect(result).toEqual({
        data: mockCities,
        total: 2,
        page: 1,
        lastPage: 1,
      });
    });

    it('should handle pagination correctly', async () => {
      mockRepo.findAndCount.mockResolvedValue([mockCities, 20]);

      const result = await service.findAll(2, 5);

      expect(mockRepo.findAndCount).toHaveBeenCalledWith({
        where: {},
        take: 5,
        skip: 5,
        withDeleted: false,
      });
      expect(result.lastPage).toBe(4);
    });
  });

  describe('findOne', () => {
    it('should return a city by id', async () => {
      mockRepo.findOne.mockResolvedValue(mockCity);

      const result = await service.findOne(1);

      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockCity);
    });
  });

  describe('update', () => {
    it('should update a city', async () => {
      const updateCityDto: UpdateCityDto = { name: 'Updated Lahore' };
      const updatedCity = { ...mockCity, ...updateCityDto };

      mockRepo.findOne.mockResolvedValue(mockCity);
      mockRepo.save.mockResolvedValue(updatedCity);

      const result = await service.update(1, updateCityDto);

      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepo.save).toHaveBeenCalled();
      expect(result).toEqual(updatedCity);
    });

    it('should throw NotFoundException when city not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(
        new NotFoundException('City with id 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a city', async () => {
      mockRepo.findOne.mockResolvedValue(mockCity);
      mockRepo.softRemove.mockResolvedValue(mockCity);

      const result = await service.remove(1);

      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepo.softRemove).toHaveBeenCalledWith(mockCity);
      expect(result).toEqual(mockCity);
    });

    it('should throw NotFoundException when city not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('City with id 999 not found'),
      );
    });
  });
});
