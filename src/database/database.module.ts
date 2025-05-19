import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { seedInitialData } from './seeds/initial.seed';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'management_app',
      autoLoadEntities: true,
      synchronize: true, // Enable this only in development
      logging: ['error', 'warn'],
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    // Run initial seeding
    await seedInitialData(this.dataSource);
  }
} 