import { Module } from '@nestjs/common';
import { FuelEntriesService } from './fuel-entries.service';
import { FuelEntriesController } from './fuel-entries.controller';

@Module({
  controllers: [FuelEntriesController],
  providers: [FuelEntriesService],
  exports: [FuelEntriesService],
})
export class FuelEntriesModule {}
