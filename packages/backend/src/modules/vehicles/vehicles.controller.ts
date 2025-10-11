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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@ApiTags('vehicles')
@Controller('vehicles')
@UseGuards(AuthenticatedGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({ status: 201, description: 'Vehicle created successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Req() req: any, @Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(req.user.id, createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles for current user' })
  @ApiResponse({ status: 200, description: 'Returns list of vehicles' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  findAll(@Req() req: any) {
    return this.vehiclesService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by ID' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiResponse({ status: 200, description: 'Returns vehicle data' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, req.user.id, updateVehicleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiResponse({ status: 200, description: 'Vehicle deleted successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.remove(id, req.user.id);
  }
}
