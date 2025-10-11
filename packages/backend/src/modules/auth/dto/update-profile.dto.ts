import { IsOptional, IsString, IsIn, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    required: false,
    description: 'Display name',
    maxLength: 255,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  displayName?: string;

  @ApiProperty({
    required: false,
    description: 'Preferred currency (ISO code)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  preferredCurrency?: string;

  @ApiProperty({
    required: false,
    description: 'Preferred distance unit',
    enum: ['km', 'mi'],
    example: 'mi',
  })
  @IsOptional()
  @IsIn(['km', 'mi'])
  preferredDistanceUnit?: string;

  @ApiProperty({
    required: false,
    description: 'Preferred volume unit',
    enum: ['L', 'gal'],
    example: 'gal',
  })
  @IsOptional()
  @IsIn(['L', 'gal'])
  preferredVolumeUnit?: string;

  @ApiProperty({
    required: false,
    description: 'Timezone',
    example: 'America/New_York',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  timezone?: string;
}
