import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

describe('CitiesController', () => {
  let controller: CitiesController;
  let service: CitiesService;

  const mockCity = {
    id: 1,
    name: 'Lahore',
    description: 'City of gardens',
    active: true,
    country: 'Pakistan',
  };

  const mockCitiesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        {
          provide: CitiesService,
          useValue: mockCitiesService,
        },
      ],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
    service = module.get<CitiesService>(CitiesService);
    
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a city', async () => {
      const createCityDto: CreateCityDto = {
        name: 'Islamabad',
        description: 'Capital city',
        country: 'Pakistan',
      };

      mockCitiesService.create.mockResolvedValue(mockCity);

      const result = await controller.create(createCityDto);

      expect(service.create).toHaveBeenCalledWith(createCityDto);
      expect(result).toEqual(mockCity);
    });
  });

  describe('findAll', () => {
    it('should return paginated cities', async () => {
      const paginatedResult = {
        data: [mockCity],
        total: 1,
        page: 1,
        lastPage: 1,
      };

      mockCitiesService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll(1, 10);

      expect(service.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(paginatedResult);
    });

    it('should use default pagination values', async () => {
      const paginatedResult = {
        data: [mockCity],
        total: 1,
        page: 1,
        lastPage: 1,
      };

      mockCitiesService.findAll.mockResolvedValue(paginatedResult);

      await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findOne', () => {
    it('should return a city by id', async () => {
      mockCitiesService.findOne.mockResolvedValue(mockCity);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCity);
    });
  });

  describe('update', () => {
    it('should update a city', async () => {
      const updateCityDto: UpdateCityDto = { name: 'Updated Lahore' };
      const updatedCity = { ...mockCity, ...updateCityDto };

      mockCitiesService.update.mockResolvedValue(updatedCity);

      const result = await controller.update('1', updateCityDto);

      expect(service.update).toHaveBeenCalledWith(1, updateCityDto);
      expect(result).toEqual(updatedCity);
    });
  });

  describe('remove', () => {
    it('should remove a city', async () => {
      mockCitiesService.remove.mockResolvedValue(mockCity);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCity);
    });
  });
});
