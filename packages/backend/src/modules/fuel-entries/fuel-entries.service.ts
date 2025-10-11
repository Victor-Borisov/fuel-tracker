import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/database.module';
import { CreateFuelEntryDto } from './dto/create-fuel-entry.dto';
import { UpdateFuelEntryDto } from './dto/update-fuel-entry.dto';

@Injectable()
export class FuelEntriesService {
  constructor(@Inject(PG_CONNECTION) private pool: Pool) {}

  async create(userId: number, createFuelEntryDto: CreateFuelEntryDto) {
    const {
      vehicleId,
      entryDate,
      odometer,
      stationName,
      fuelBrand,
      fuelGrade,
      quantityLiters,
      totalAmount,
      currency,
      notes,
    } = createFuelEntryDto;

    const vehicleCheck = await this.pool.query(
      'SELECT id FROM vehicles WHERE id = $1 AND user_id = $2',
      [vehicleId, userId],
    );

    if (vehicleCheck.rows.length === 0) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }

    const lastEntry = await this.pool.query(
      `SELECT odometer FROM fuel_entries
       WHERE vehicle_id = $1
       ORDER BY entry_date DESC, odometer DESC
       LIMIT 1`,
      [vehicleId],
    );

    if (lastEntry.rows.length > 0 && odometer <= lastEntry.rows[0].odometer) {
      throw new BadRequestException(
        `Odometer value must be greater than the last entry (${lastEntry.rows[0].odometer})`,
      );
    }

    const result = await this.pool.query(
      `INSERT INTO fuel_entries
       (user_id, vehicle_id, entry_date, odometer, station_name, fuel_brand, fuel_grade,
        quantity_liters, total_amount, currency, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, user_id, vehicle_id, entry_date, odometer, station_name, fuel_brand,
                 fuel_grade, quantity_liters, total_amount, currency, notes, created_at, updated_at`,
      [
        userId,
        vehicleId,
        entryDate,
        odometer,
        stationName,
        fuelBrand,
        fuelGrade,
        quantityLiters,
        totalAmount,
        currency || 'USD',
        notes || null,
      ],
    );

    return result.rows[0];
  }

  async findAll(userId: number, vehicleId?: number) {
    let query = `
      SELECT fe.id, fe.user_id, fe.vehicle_id, fe.entry_date, fe.odometer,
             fe.station_name, fe.fuel_brand, fe.fuel_grade, fe.quantity_liters,
             fe.total_amount, fe.currency, fe.notes, fe.created_at, fe.updated_at,
             v.name as vehicle_name
      FROM fuel_entries fe
      JOIN vehicles v ON fe.vehicle_id = v.id
      WHERE fe.user_id = $1
    `;
    const params: any[] = [userId];

    if (vehicleId) {
      query += ' AND fe.vehicle_id = $2';
      params.push(vehicleId);
    }

    query += ' ORDER BY fe.entry_date DESC, fe.odometer DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async findOne(id: number, userId: number) {
    const result = await this.pool.query(
      `SELECT fe.id, fe.user_id, fe.vehicle_id, fe.entry_date, fe.odometer,
              fe.station_name, fe.fuel_brand, fe.fuel_grade, fe.quantity_liters,
              fe.total_amount, fe.currency, fe.notes, fe.created_at, fe.updated_at,
              v.name as vehicle_name
       FROM fuel_entries fe
       JOIN vehicles v ON fe.vehicle_id = v.id
       WHERE fe.id = $1 AND fe.user_id = $2`,
      [id, userId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Fuel entry with ID ${id} not found`);
    }

    return result.rows[0];
  }

  async update(id: number, userId: number, updateFuelEntryDto: UpdateFuelEntryDto) {
    await this.findOne(id, userId);

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updateFuelEntryDto.entryDate !== undefined) {
      fields.push(`entry_date = $${paramIndex++}`);
      values.push(updateFuelEntryDto.entryDate);
    }
    if (updateFuelEntryDto.odometer !== undefined) {
      fields.push(`odometer = $${paramIndex++}`);
      values.push(updateFuelEntryDto.odometer);
    }
    if (updateFuelEntryDto.stationName !== undefined) {
      fields.push(`station_name = $${paramIndex++}`);
      values.push(updateFuelEntryDto.stationName);
    }
    if (updateFuelEntryDto.fuelBrand !== undefined) {
      fields.push(`fuel_brand = $${paramIndex++}`);
      values.push(updateFuelEntryDto.fuelBrand);
    }
    if (updateFuelEntryDto.fuelGrade !== undefined) {
      fields.push(`fuel_grade = $${paramIndex++}`);
      values.push(updateFuelEntryDto.fuelGrade);
    }
    if (updateFuelEntryDto.quantityLiters !== undefined) {
      fields.push(`quantity_liters = $${paramIndex++}`);
      values.push(updateFuelEntryDto.quantityLiters);
    }
    if (updateFuelEntryDto.totalAmount !== undefined) {
      fields.push(`total_amount = $${paramIndex++}`);
      values.push(updateFuelEntryDto.totalAmount);
    }
    if (updateFuelEntryDto.currency !== undefined) {
      fields.push(`currency = $${paramIndex++}`);
      values.push(updateFuelEntryDto.currency);
    }
    if (updateFuelEntryDto.notes !== undefined) {
      fields.push(`notes = $${paramIndex++}`);
      values.push(updateFuelEntryDto.notes);
    }

    if (fields.length === 0) {
      return this.findOne(id, userId);
    }

    values.push(id, userId);

    const result = await this.pool.query(
      `UPDATE fuel_entries
       SET ${fields.join(', ')}
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex}
       RETURNING id, user_id, vehicle_id, entry_date, odometer, station_name, fuel_brand,
                 fuel_grade, quantity_liters, total_amount, currency, notes, created_at, updated_at`,
      values,
    );

    return result.rows[0];
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    await this.pool.query(
      'DELETE FROM fuel_entries WHERE id = $1 AND user_id = $2',
      [id, userId],
    );

    return { message: 'Fuel entry deleted successfully' };
  }
}
