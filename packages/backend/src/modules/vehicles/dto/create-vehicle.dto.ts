import { IsString, IsInt, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({
    example: 'Toyota Camry',
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
    example: 'Gasoline',
    description: 'Fuel type (Gasoline, Diesel, Electric, Hybrid, etc.)',
    required: false,
  })
  @IsOptional()
  @IsString()
  fuelType?: string;

  @ApiProperty({
    example: 'ABC-123',
    description: 'Vehicle license plate number',
    required: false,
  })
  @IsOptional()
  @IsString()
  licensePlate?: string;

  @ApiProperty({
    example: 54.0,
    description: 'Tank capacity in liters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  tankCapacityLiters?: number;
}
