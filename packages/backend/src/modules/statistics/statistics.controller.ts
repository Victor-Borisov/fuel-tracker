import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { StatisticsQueryDto, PeriodType, UnitSystem } from './dto/statistics-query.dto';

@ApiTags('statistics')
@Controller('statistics')
@UseGuards(AuthenticatedGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('vehicles/:vehicleId')
  @ApiOperation({
    summary: 'Get fuel consumption statistics for a specific vehicle',
    description: 'Calculates consumption (L/100km or MPG), cost per liter/gallon, cost per 100km/mile for each fill-up. Supports period filtering and unit system selection.'
  })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle ID' })
  @ApiQuery({ name: 'period', enum: PeriodType, required: false, description: 'Time period for statistics' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for custom period (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for custom period (ISO 8601)' })
  @ApiQuery({ name: 'units', enum: UnitSystem, required: false, description: 'Unit system (metric or imperial)' })
  @ApiResponse({
    status: 200,
    description: 'Returns detailed statistics including per-entry calculations and summary',
    schema: {
      example: {
        vehicleId: 1,
        vehicleName: "My Tesla Model 3",
        totalEntries: 3,
        calculations: [
          {
            entryId: 2,
            entryDate: "2025-01-15",
            distanceTraveled: 200,
            fuelConsumed: 40,
            consumptionPer100km: 20,
            mpg: 11.76,
            costPerLiter: 1.8,
            costPerGallon: 6.81,
            costPer100km: 36,
            costPerMile: 0.36,
            currency: "USD"
          }
        ],
        summary: {
          totalDistance: 400,
          totalFuel: 85.5,
          totalCost: 147.5,
          averageConsumption: 21.38,
          averageCostPerLiter: 1.73,
          averageCostPer100km: 36.88,
          last3EntriesAvgConsumption: 20.5,
          currency: "USD"
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  getVehicleStatistics(
    @Req() req: any,
    @Param('vehicleId', ParseIntPipe) vehicleId: number,
    @Query() query: StatisticsQueryDto,
  ) {
    return this.statisticsService.getVehicleStatistics(vehicleId, req.user.id, query);
  }

  @Get('overview')
  @ApiOperation({
    summary: 'Get overall statistics for all user vehicles',
    description: 'Returns summary statistics for each vehicle and overall totals. Supports period filtering and unit system selection.'
  })
  @ApiQuery({ name: 'period', enum: PeriodType, required: false, description: 'Time period for statistics' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for custom period (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for custom period (ISO 8601)' })
  @ApiQuery({ name: 'units', enum: UnitSystem, required: false, description: 'Unit system (metric or imperial)' })
  @ApiResponse({
    status: 200,
    description: 'Returns statistics for all vehicles',
    schema: {
      example: {
        totalVehicles: 2,
        totalFuelEntries: 10,
        vehicles: [
          {
            vehicleId: 1,
            vehicleName: "My Tesla Model 3",
            totalEntries: 5,
            summary: {
              totalDistance: 500,
              totalFuel: 100,
              totalCost: 180,
              averageConsumption: 20,
              averageCostPerLiter: 1.8,
              averageCostPer100km: 36,
              last3EntriesAvgConsumption: 19.5,
              currency: "USD"
            }
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  getUserOverallStatistics(@Req() req: any, @Query() query: StatisticsQueryDto) {
    return this.statisticsService.getUserOverallStatistics(req.user.id, query);
  }

  @Get('vehicles/:vehicleId/brand-grade')
  @ApiOperation({
    summary: 'Get fuel statistics by brand and grade for a vehicle',
    description: 'Returns aggregated statistics grouped by fuel brand and grade. Shows fill-up count, total fuel consumed, total cost, and average cost per liter/gallon for each brand-grade combination.'
  })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle ID' })
  @ApiQuery({ name: 'period', enum: PeriodType, required: false, description: 'Time period for statistics' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for custom period (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for custom period (ISO 8601)' })
  @ApiQuery({ name: 'units', enum: UnitSystem, required: false, description: 'Unit system (metric or imperial)' })
  @ApiResponse({
    status: 200,
    description: 'Returns brand and grade statistics',
    schema: {
      example: [
        {
          brand: "Shell",
          grade: "95 RON",
          fillUpCount: 5,
          totalLiters: 227.5,
          totalGallons: 60.11,
          totalCost: 377.5,
          avgCostPerLiter: 1.66,
          avgCostPerGallon: 6.28,
          currency: "USD"
        },
        {
          brand: "BP",
          grade: "98 RON",
          fillUpCount: 3,
          totalLiters: 136.5,
          totalGallons: 36.05,
          totalCost: 245.7,
          avgCostPerLiter: 1.80,
          avgCostPerGallon: 6.81,
          currency: "USD"
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  getBrandGradeStatistics(
    @Req() req: any,
    @Param('vehicleId', ParseIntPipe) vehicleId: number,
    @Query() query: StatisticsQueryDto,
  ) {
    return this.statisticsService.getBrandGradeStatistics(vehicleId, req.user.id, query);
  }
}
