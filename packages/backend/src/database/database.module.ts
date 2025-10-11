import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const PG_CONNECTION = 'PG_CONNECTION';

const databaseProvider = {
  provide: PG_CONNECTION,
  useFactory: (configService: ConfigService) => {
    const pool = new Pool({
      connectionString: configService.get<string>('DATABASE_URL'),
    });
    return pool;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [databaseProvider],
  exports: [PG_CONNECTION],
})
export class DatabaseModule {}
