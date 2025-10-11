import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/database.module';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(@Inject(PG_CONNECTION) private pool: Pool) {}

  async create(userId: number, createVehicleDto: CreateVehicleDto) {
    const { name, makeModel, year, fuelType } = createVehicleDto;

    const result = await this.pool.query(
      `INSERT INTO vehicles (user_id, name, make, model, year, fuel_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, name, make, model, year, fuel_type, created_at, updated_at`,
      [userId, name, makeModel || null, null, year || null, fuelType || null],
    );

    return result.rows[0];
  }

  async findAll(userId: number) {
    const result = await this.pool.query(
      `SELECT id, user_id, name, make, model, year, fuel_type, created_at, updated_at
       FROM vehicles
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );

    return result.rows;
  }

  async findOne(id: number, userId: number) {
    const result = await this.pool.query(
      `SELECT id, user_id, name, make, model, year, fuel_type, created_at, updated_at
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

    if (updateVehicleDto.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updateVehicleDto.name);
    }
    if (updateVehicleDto.makeModel !== undefined) {
      fields.push(`make = $${paramIndex++}`);
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

    if (fields.length === 0) {
      return this.findOne(id, userId);
    }

    values.push(id, userId);

    const result = await this.pool.query(
      `UPDATE vehicles
       SET ${fields.join(', ')}
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex}
       RETURNING id, user_id, name, make, model, year, fuel_type, created_at, updated_at`,
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
