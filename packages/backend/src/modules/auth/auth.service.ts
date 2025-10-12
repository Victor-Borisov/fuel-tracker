import { Injectable, Inject, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { PG_CONNECTION } from '../../database/database.module';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(@Inject(PG_CONNECTION) private pool: Pool) {}

  private transformUserToCamelCase(user: any) {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      preferredCurrency: user.preferred_currency,
      preferredDistanceUnit: user.preferred_distance_unit,
      preferredVolumeUnit: user.preferred_volume_unit,
      timezone: user.timezone,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, displayName } = registerDto;

    const existingUser = await this.pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email],
    );

    if (existingUser.rows.length > 0) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await this.pool.query(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ($1, $2, $3)
       RETURNING id, email, display_name, created_at`,
      [email, passwordHash, displayName || null],
    );

    return this.transformUserToCamelCase(result.rows[0]);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    const user = result.rows[0];

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return null;
    }

    const { password_hash, ...userWithoutPassword } = user;
    return this.transformUserToCamelCase(userWithoutPassword);
  }

  async findById(id: number) {
    const result = await this.pool.query(
      'SELECT id, email, display_name, preferred_currency, preferred_distance_unit, preferred_volume_unit, timezone, created_at FROM users WHERE id = $1',
      [id],
    );

    return this.transformUserToCamelCase(result.rows[0]);
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updateProfileDto.displayName !== undefined) {
      updates.push(`display_name = $${paramIndex}`);
      values.push(updateProfileDto.displayName);
      paramIndex++;
    }

    if (updateProfileDto.preferredCurrency !== undefined) {
      updates.push(`preferred_currency = $${paramIndex}`);
      values.push(updateProfileDto.preferredCurrency);
      paramIndex++;
    }

    if (updateProfileDto.preferredDistanceUnit !== undefined) {
      updates.push(`preferred_distance_unit = $${paramIndex}`);
      values.push(updateProfileDto.preferredDistanceUnit);
      paramIndex++;
    }

    if (updateProfileDto.preferredVolumeUnit !== undefined) {
      updates.push(`preferred_volume_unit = $${paramIndex}`);
      values.push(updateProfileDto.preferredVolumeUnit);
      paramIndex++;
    }

    if (updateProfileDto.timezone !== undefined) {
      updates.push(`timezone = $${paramIndex}`);
      values.push(updateProfileDto.timezone);
      paramIndex++;
    }

    if (updates.length === 0) {
      return user;
    }

    updates.push(`updated_at = NOW()`);
    values.push(userId);

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, display_name, preferred_currency, preferred_distance_unit, preferred_volume_unit, timezone, created_at, updated_at
    `;

    const result = await this.pool.query(query, values);
    return this.transformUserToCamelCase(result.rows[0]);
  }

  async deleteAccount(userId: number) {
    const result = await this.pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [userId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('User not found');
    }

    return { message: 'Account deleted successfully' };
  }
}
