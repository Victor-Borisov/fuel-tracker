import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/database.module';
import { PeriodType, UnitSystem, StatisticsQueryDto } from './dto/statistics-query.dto';

export interface FuelEntryStats {
  id: number;
  entry_date: Date;
  odometer: number;
  quantity_liters: number;
  total_amount: number;
  currency: string;
  fuel_brand?: string;
  fuel_grade?: string;
}

export interface ConsumptionData {
  entryId: number;
  entryDate: Date;
  distanceTraveled: number;
  fuelConsumed: number;
  consumptionPer100km: number;
  mpg?: number;
  costPerLiter: number;
  costPerGallon?: number;
  costPer100km: number;
  costPerMile?: number;
  currency: string;
}

export interface BrandGradeStats {
  brand: string;
  grade: string;
  fillUpCount: number;
  totalLiters: number;
  totalGallons?: number;
  totalCost: number;
  avgCostPerLiter: number;
  avgCostPerGallon?: number;
  avgConsumptionPer100km?: number;
  avgMpg?: number;
  currency: string;
}

@Injectable()
export class StatisticsService {
  private readonly LITERS_PER_GALLON = 3.78541;
  private readonly KM_PER_MILE = 1.60934;

  constructor(@Inject(PG_CONNECTION) private pool: Pool) {}

  private calculateDateRange(query: StatisticsQueryDto): { startDate: Date | null; endDate: Date | null } {
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (query.period === PeriodType.CUSTOM) {
      if (query.startDate) startDate = new Date(query.startDate);
      if (query.endDate) endDate = new Date(query.endDate);
    } else if (query.period === PeriodType.LAST_30_DAYS) {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);
      endDate = now;
    } else if (query.period === PeriodType.LAST_90_DAYS) {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 90);
      endDate = now;
    } else if (query.period === PeriodType.YEAR_TO_DATE) {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = now;
    }

    return { startDate, endDate };
  }

  private buildDateFilter(startDate: Date | null, endDate: Date | null, startIndex: number = 1): { clause: string; params: Date[] } {
    const conditions: string[] = [];
    const params: Date[] = [];
    let paramIndex = startIndex;

    if (startDate) {
      conditions.push(`entry_date >= $${paramIndex}`);
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      conditions.push(`entry_date <= $${paramIndex}`);
      params.push(endDate);
    }

    return {
      clause: conditions.length > 0 ? conditions.join(' AND ') : '',
      params,
    };
  }

  private convertToImperial(data: ConsumptionData): ConsumptionData {
    const distanceInMiles = data.distanceTraveled / this.KM_PER_MILE;
    const fuelInGallons = data.fuelConsumed / this.LITERS_PER_GALLON;

    return {
      ...data,
      mpg: distanceInMiles / fuelInGallons,
      costPerGallon: data.costPerLiter * this.LITERS_PER_GALLON,
      costPerMile: data.costPer100km / 100 / this.KM_PER_MILE,
    };
  }

  private convertBrandStatsToImperial(stats: BrandGradeStats): BrandGradeStats {
    return {
      ...stats,
      totalGallons: stats.totalLiters / this.LITERS_PER_GALLON,
      avgCostPerGallon: stats.avgCostPerLiter * this.LITERS_PER_GALLON,
      avgMpg: stats.avgConsumptionPer100km
        ? (100 / stats.avgConsumptionPer100km) / this.LITERS_PER_GALLON * this.KM_PER_MILE
        : undefined,
    };
  }

  async getVehicleStatistics(vehicleId: number, userId: number, query: StatisticsQueryDto = {}) {
    const vehicleCheck = await this.pool.query(
      'SELECT id, name FROM vehicles WHERE id = $1 AND user_id = $2',
      [vehicleId, userId],
    );

    if (vehicleCheck.rows.length === 0) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }

    const vehicle = vehicleCheck.rows[0];

    const { startDate, endDate } = this.calculateDateRange(query);
    const dateFilter = this.buildDateFilter(startDate, endDate, 3);

    let sql = `SELECT id, entry_date, odometer, quantity_liters, total_amount, currency, fuel_brand, fuel_grade
       FROM fuel_entries
       WHERE vehicle_id = $1 AND user_id = $2`;

    const params: any[] = [vehicleId, userId];

    if (dateFilter.clause) {
      sql += ` AND ${dateFilter.clause}`;
      params.push(...dateFilter.params);
    }

    sql += ` ORDER BY entry_date ASC, odometer ASC`;

    const entries = await this.pool.query<FuelEntryStats>(sql, params);

    if (entries.rows.length < 2) {
      return {
        vehicleId,
        vehicleName: vehicle.name,
        totalEntries: entries.rows.length,
        message: 'Need at least 2 fuel entries to calculate statistics',
        calculations: [],
        summary: null,
      };
    }

    const calculations: ConsumptionData[] = [];

    for (let i = 1; i < entries.rows.length; i++) {
      const currentEntry = entries.rows[i];
      const previousEntry = entries.rows[i - 1];

      const distanceTraveled = currentEntry.odometer - previousEntry.odometer;
      const fuelConsumed = parseFloat(currentEntry.quantity_liters.toString());
      const consumptionPer100km = (fuelConsumed / distanceTraveled) * 100;
      const costPerLiter = parseFloat(currentEntry.total_amount.toString()) / fuelConsumed;
      const costPer100km = consumptionPer100km * costPerLiter;

      let calcData: ConsumptionData = {
        entryId: currentEntry.id,
        entryDate: currentEntry.entry_date,
        distanceTraveled,
        fuelConsumed,
        consumptionPer100km: Math.round(consumptionPer100km * 100) / 100,
        costPerLiter: Math.round(costPerLiter * 100) / 100,
        costPer100km: Math.round(costPer100km * 100) / 100,
        currency: currentEntry.currency,
      };

      if (query.units === UnitSystem.IMPERIAL) {
        calcData = this.convertToImperial(calcData);
        calcData.mpg = Math.round((calcData.mpg || 0) * 100) / 100;
        calcData.costPerGallon = Math.round((calcData.costPerGallon || 0) * 100) / 100;
        calcData.costPerMile = Math.round((calcData.costPerMile || 0) * 1000) / 1000;
      }

      calculations.push(calcData);
    }

    const totalDistance = entries.rows[entries.rows.length - 1].odometer - entries.rows[0].odometer;
    const totalFuel = calculations.reduce((sum, calc) => sum + calc.fuelConsumed, 0);
    const totalCost = entries.rows.slice(1).reduce((sum, entry) => sum + parseFloat(entry.total_amount.toString()), 0);
    const averageConsumption = (totalFuel / totalDistance) * 100;
    const averageCostPerLiter = totalCost / totalFuel;
    const averageCostPer100km = averageConsumption * averageCostPerLiter;

    const last3Calculations = calculations.slice(-3);
    const last3AvgConsumption = last3Calculations.length > 0
      ? last3Calculations.reduce((sum, calc) => sum + calc.consumptionPer100km, 0) / last3Calculations.length
      : null;

    return {
      vehicleId,
      vehicleName: vehicle.name,
      totalEntries: entries.rows.length,
      calculations,
      summary: {
        totalDistance,
        totalFuel: Math.round(totalFuel * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        averageConsumption: Math.round(averageConsumption * 100) / 100,
        averageCostPerLiter: Math.round(averageCostPerLiter * 100) / 100,
        averageCostPer100km: Math.round(averageCostPer100km * 100) / 100,
        last3EntriesAvgConsumption: last3AvgConsumption ? Math.round(last3AvgConsumption * 100) / 100 : null,
        currency: entries.rows[1].currency,
      },
    };
  }

  async getUserOverallStatistics(userId: number, query: StatisticsQueryDto = {}) {
    const vehicles = await this.pool.query(
      'SELECT id, name FROM vehicles WHERE user_id = $1 ORDER BY name ASC',
      [userId],
    );

    if (vehicles.rows.length === 0) {
      return {
        totalVehicles: 0,
        totalFuelEntries: 0,
        vehicles: [],
        message: 'No vehicles found',
      };
    }

    const vehicleStats = await Promise.all(
      vehicles.rows.map(async (vehicle) => {
        const stats = await this.getVehicleStatistics(vehicle.id, userId, query);
        return {
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          totalEntries: stats.totalEntries,
          summary: stats.summary,
        };
      }),
    );

    const { startDate, endDate } = this.calculateDateRange(query);
    const dateFilter = this.buildDateFilter(startDate, endDate, 2);

    let countSql = 'SELECT COUNT(*) as count FROM fuel_entries WHERE user_id = $1';
    const countParams: any[] = [userId];

    if (dateFilter.clause) {
      countSql += ` AND ${dateFilter.clause}`;
      countParams.push(...dateFilter.params);
    }

    const totalEntriesResult = await this.pool.query(countSql, countParams);

    return {
      totalVehicles: vehicles.rows.length,
      totalFuelEntries: parseInt(totalEntriesResult.rows[0].count),
      vehicles: vehicleStats,
    };
  }

  async getBrandGradeStatistics(vehicleId: number, userId: number, query: StatisticsQueryDto = {}): Promise<BrandGradeStats[]> {
    const vehicleCheck = await this.pool.query(
      'SELECT id FROM vehicles WHERE id = $1 AND user_id = $2',
      [vehicleId, userId],
    );

    if (vehicleCheck.rows.length === 0) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }

    const { startDate, endDate } = this.calculateDateRange(query);
    const dateFilter = this.buildDateFilter(startDate, endDate, 3);

    let sql = `
      SELECT
        COALESCE(fuel_brand, 'Unknown') as brand,
        COALESCE(fuel_grade, 'Unknown') as grade,
        COUNT(*) as fill_up_count,
        SUM(quantity_liters) as total_liters,
        SUM(total_amount) as total_cost,
        AVG(total_amount / quantity_liters) as avg_cost_per_liter,
        currency
      FROM fuel_entries
      WHERE vehicle_id = $1 AND user_id = $2
    `;

    const params: any[] = [vehicleId, userId];

    if (dateFilter.clause) {
      sql += ` AND ${dateFilter.clause}`;
      params.push(...dateFilter.params);
    }

    sql += ` GROUP BY fuel_brand, fuel_grade, currency ORDER BY total_cost DESC`;

    const result = await this.pool.query(sql, params);

    let stats: BrandGradeStats[] = result.rows.map(row => ({
      brand: row.brand,
      grade: row.grade,
      fillUpCount: parseInt(row.fill_up_count),
      totalLiters: Math.round(parseFloat(row.total_liters) * 100) / 100,
      totalCost: Math.round(parseFloat(row.total_cost) * 100) / 100,
      avgCostPerLiter: Math.round(parseFloat(row.avg_cost_per_liter) * 100) / 100,
      avgConsumptionPer100km: undefined,
      currency: row.currency,
    }));

    if (query.units === UnitSystem.IMPERIAL) {
      stats = stats.map(s => this.convertBrandStatsToImperial(s));
      stats = stats.map(s => ({
        ...s,
        totalGallons: s.totalGallons ? Math.round(s.totalGallons * 100) / 100 : undefined,
        avgCostPerGallon: s.avgCostPerGallon ? Math.round(s.avgCostPerGallon * 100) / 100 : undefined,
        avgMpg: s.avgMpg ? Math.round(s.avgMpg * 100) / 100 : undefined,
      }));
    }

    return stats;
  }
}
