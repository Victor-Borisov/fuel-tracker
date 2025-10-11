import { Injectable, Inject, ConflictException, UnauthorizedException } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { PG_CONNECTION } from '../../database/database.module';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(@Inject(PG_CONNECTION) private pool: Pool) {}

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

    return result.rows[0];
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
    return userWithoutPassword;
  }

  async findById(id: number) {
    const result = await this.pool.query(
      'SELECT id, email, display_name, preferred_currency, preferred_distance_unit, preferred_volume_unit, timezone, created_at FROM users WHERE id = $1',
      [id],
    );

    return result.rows[0] || null;
  }
}
