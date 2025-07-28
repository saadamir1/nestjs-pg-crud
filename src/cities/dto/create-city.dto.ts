import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {
  @ApiProperty({ example: 'New York', description: 'Name of the city' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'The Big Apple',
    description: 'Description of the city',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the city is active',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiProperty({
    example: 'United States',
    description: 'Country where the city is located',
    required: false,
  })
  @IsString()
  @IsOptional()
  country?: string;
}
