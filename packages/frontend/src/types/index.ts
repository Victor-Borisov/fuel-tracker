export interface User {
  id: number;
  email: string;
  display_name: string | null;
  preferred_currency: string;
  preferred_distance_unit: 'km' | 'mi';
  preferred_volume_unit: 'L' | 'gal';
  timezone: string;
  created_at: string;
  updated_at?: string;
}

export interface Vehicle {
  id: number;
  makeModel?: string | null;
  year?: number | null;
  fuelType?: string | null;
  licensePlate?: string | null;
  tankCapacityLiters?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FuelEntry {
  id: number;
  userId: number;
  vehicleId: number;
  entryDate: string;
  odometer: number;
  stationName: string | null;
  fuelBrand: string | null;
  fuelGrade: string | null;
  quantityLiters: number;
  totalAmount: number;
  currency: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  vehicleName?: string;
}

export interface ConsumptionData {
  entryId: number;
  entryDate: string;
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

export interface StatisticsSummary {
  totalDistance: number;
  totalFuel: number;
  totalCost: number;
  averageConsumption: number;
  averageCostPerLiter: number;
  averageCostPer100km: number;
  last3EntriesAvgConsumption: number | null;
  currency: string;
}

export interface VehicleStatistics {
  vehicleId: number;
  vehicleName: string;
  totalEntries: number;
  calculations: ConsumptionData[];
  summary: StatisticsSummary | null;
  message?: string;
  consumptionHistory?: ConsumptionData[];
  fuelBrandStats?: BrandGradeStats[];
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
  count?: number;
  averagePrice?: number;
}

export type PeriodType = 'last_30_days' | 'last_90_days' | 'year_to_date' | 'all_time' | 'custom';
export type UnitSystem = 'metric' | 'imperial';

export interface StatisticsQuery {
  period?: PeriodType;
  startDate?: string;
  endDate?: string;
  units?: UnitSystem;
}
