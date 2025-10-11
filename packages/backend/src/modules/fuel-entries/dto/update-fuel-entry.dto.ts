import { PartialType } from '@nestjs/swagger';
import { CreateFuelEntryDto } from './create-fuel-entry.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateFuelEntryDto extends PartialType(
  OmitType(CreateFuelEntryDto, ['vehicleId'] as const),
) {}
