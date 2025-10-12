import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/database.module';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(@Inject(PG_CONNECTION) private pool: Pool) {}

  async create(userId: number, createVehicleDto: CreateVehicleDto) {
    const { makeModel, year, fuelType, licensePlate, tankCapacityLiters } = createVehicleDto;

    const result = await this.pool.query(
      `INSERT INTO vehicles (user_id, name, year, fuel_type, license_plate, tank_capacity_liters)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, name as "makeModel", year, fuel_type as "fuelType", license_plate as "licensePlate", tank_capacity_liters as "tankCapacityLiters", created_at as "createdAt", updated_at as "updatedAt"`,
      [userId, makeModel || null, year || null, fuelType || null, licensePlate || null, tankCapacityLiters || null],
    );

    return result.rows[0];
  }

  async findAll(userId: number) {
    const result = await this.pool.query(
      `SELECT id, user_id, name as "makeModel", year, fuel_type as "fuelType", license_plate as "licensePlate", tank_capacity_liters as "tankCapacityLiters", created_at as "createdAt", updated_at as "updatedAt"
       FROM vehicles
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );

    return result.rows;
  }

  async findOne(id: number, userId: number) {
    const result = await this.pool.query(
      `SELECT id, user_id, name as "makeModel", year, fuel_type as "fuelType", license_plate as "licensePlate", tank_capacity_liters as "tankCapacityLiters", created_at as "createdAt", updated_at as "updatedAt"
       FROM vehicles
       WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return result.rows[0];
  }

  async update(id: number, userId: number, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(id, userId);

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updateVehicleDto.makeModel !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updateVehicleDto.makeModel);
    }
    if (updateVehicleDto.year !== undefined) {
      fields.push(`year = $${paramIndex++}`);
      values.push(updateVehicleDto.year);
    }
    if (updateVehicleDto.fuelType !== undefined) {
      fields.push(`fuel_type = $${paramIndex++}`);
      values.push(updateVehicleDto.fuelType);
    }
    if (updateVehicleDto.licensePlate !== undefined) {
      fields.push(`license_plate = $${paramIndex++}`);
      values.push(updateVehicleDto.licensePlate);
    }
    if (updateVehicleDto.tankCapacityLiters !== undefined) {
      fields.push(`tank_capacity_liters = $${paramIndex++}`);
      values.push(updateVehicleDto.tankCapacityLiters);
    }

    if (fields.length === 0) {
      return this.findOne(id, userId);
    }

    values.push(id, userId);

    const result = await this.pool.query(
      `UPDATE vehicles
       SET ${fields.join(', ')}
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex}
       RETURNING id, user_id, name as "makeModel", year, fuel_type as "fuelType", license_plate as "licensePlate", tank_capacity_liters as "tankCapacityLiters", created_at as "createdAt", updated_at as "updatedAt"`,
      values,
    );

    return result.rows[0];
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    await this.pool.query(
      'DELETE FROM vehicles WHERE id = $1 AND user_id = $2',
      [id, userId],
    );

    return { message: 'Vehicle deleted successfully' };
  }
}
