import { IsOptional, IsEnum, IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PeriodType {
  LAST_30_DAYS = 'last_30_days',
  LAST_90_DAYS = 'last_90_days',
  YEAR_TO_DATE = 'year_to_date',
  ALL_TIME = 'all_time',
  CUSTOM = 'custom',
}

export enum UnitSystem {
  METRIC = 'metric',
  IMPERIAL = 'imperial',
}

export class StatisticsQueryDto {
  @ApiProperty({
    enum: PeriodType,
    required: false,
    default: PeriodType.LAST_30_DAYS,
    description: 'Time period for statistics',
  })
  @IsOptional()
  @IsEnum(PeriodType)
  period?: PeriodType;

  @ApiProperty({
    required: false,
    description: 'Start date for custom period (ISO 8601 format)',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    required: false,
    description: 'End date for custom period (ISO 8601 format)',
    example: '2025-01-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    enum: UnitSystem,
    required: false,
    default: UnitSystem.METRIC,
    description: 'Unit system for display (metric: L/100km, imperial: MPG)',
  })
  @IsOptional()
  @IsEnum(UnitSystem)
  units?: UnitSystem;
}
