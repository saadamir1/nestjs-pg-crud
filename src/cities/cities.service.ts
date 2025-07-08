import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City) private readonly citiesRepository: Repository<City>,
  ) {}
  async create(createCityDto: CreateCityDto) {
    const city = this.citiesRepository.create(createCityDto);
    return await this.citiesRepository.save(city);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.citiesRepository.findAndCount({
      where: {},
      take: limit,
      skip: (page - 1) * limit,
      withDeleted: false, // don’t include soft-deleted records
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    return await this.citiesRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    const city = await this.citiesRepository.findOne({ where: { id } });
    if (!city) {
      throw new NotFoundException(`City with id ${id} not found`);
    }
    Object.assign(city, updateCityDto);
    return await this.citiesRepository.save(city);
  }

  async remove(id: number) {
    const city = await this.citiesRepository.findOne({ where: { id } });
    if (!city) throw new NotFoundException(`City with id ${id} not found`);

    return await this.citiesRepository.softRemove(city); // soft delete
  }
}
