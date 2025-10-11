import { IsInt, IsString, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateFuelEntryDto {
  @ApiProperty({
    example: 1,
    description: 'Vehicle ID',
  })
  @IsInt()
  @Min(1)
  vehicleId: number;

  @ApiProperty({
    example: '2025-01-10',
    description: 'Date of fuel entry (YYYY-MM-DD)',
  })
  @IsDateString()
  entryDate: string;

  @ApiProperty({
    example: 15000,
    description: 'Odometer reading in kilometers',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  odometer: number;

  @ApiProperty({
    example: 'Shell',
    description: 'Gas station name',
  })
  @IsString()
  stationName: string;

  @ApiProperty({
    example: 'Shell V-Power',
    description: 'Fuel brand',
  })
  @IsString()
  fuelBrand: string;

  @ApiProperty({
    example: '95 RON',
    description: 'Fuel grade (octane rating)',
  })
  @IsString()
  fuelGrade: string;

  @ApiProperty({
    example: 45.5,
    description: 'Quantity of fuel in liters',
    minimum: 0.01,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  quantityLiters: number;

  @ApiProperty({
    example: 75.50,
    description: 'Total amount paid',
    minimum: 0.01,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  totalAmount: number;

  @ApiProperty({
    example: 'USD',
    description: 'Currency code (ISO 4217)',
    required: false,
    default: 'USD',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    example: 'Full tank, highway driving',
    description: 'Additional notes',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
