import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({
    example: 'My Tesla Model 3',
    description: 'Vehicle name/label',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Tesla Model 3',
    description: 'Vehicle make and model',
    required: false,
  })
  @IsOptional()
  @IsString()
  makeModel?: string;

  @ApiProperty({
    example: 2023,
    description: 'Vehicle year',
    minimum: 1900,
    maximum: 2100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  year?: number;

  @ApiProperty({
    example: 'Electric',
    description: 'Fuel type (Gasoline, Diesel, Electric, Hybrid, etc.)',
    required: false,
  })
  @IsOptional()
  @IsString()
  fuelType?: string;
}
