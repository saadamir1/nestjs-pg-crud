import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCityDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsString()
  @IsOptional()
  country?: string;
}
