import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FuelEntriesService } from './fuel-entries.service';
import { CreateFuelEntryDto } from './dto/create-fuel-entry.dto';
import { UpdateFuelEntryDto } from './dto/update-fuel-entry.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@ApiTags('fuel-entries')
@Controller('fuel-entries')
@UseGuards(AuthenticatedGuard)
export class FuelEntriesController {
  constructor(private readonly fuelEntriesService: FuelEntriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new fuel entry' })
  @ApiResponse({ status: 201, description: 'Fuel entry created successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data or odometer value' })
  create(@Req() req: any, @Body() createFuelEntryDto: CreateFuelEntryDto) {
    return this.fuelEntriesService.create(req.user.id, createFuelEntryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fuel entries for current user' })
  @ApiQuery({
    name: 'vehicleId',
    required: false,
    description: 'Filter by vehicle ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Returns list of fuel entries' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  findAll(@Req() req: any, @Query('vehicleId', new ParseIntPipe({ optional: true })) vehicleId?: number) {
    return this.fuelEntriesService.findAll(req.user.id, vehicleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a fuel entry by ID' })
  @ApiParam({ name: 'id', description: 'Fuel entry ID' })
  @ApiResponse({ status: 200, description: 'Returns fuel entry data' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'Fuel entry not found' })
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.fuelEntriesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a fuel entry' })
  @ApiParam({ name: 'id', description: 'Fuel entry ID' })
  @ApiResponse({ status: 200, description: 'Fuel entry updated successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'Fuel entry not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFuelEntryDto: UpdateFuelEntryDto,
  ) {
    return this.fuelEntriesService.update(id, req.user.id, updateFuelEntryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a fuel entry' })
  @ApiParam({ name: 'id', description: 'Fuel entry ID' })
  @ApiResponse({ status: 200, description: 'Fuel entry deleted successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'Fuel entry not found' })
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.fuelEntriesService.remove(id, req.user.id);
  }
}
