import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { Permission } from '../permissions/entities/permission.entity';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([Permission]),
    JwtModule.register({
      secret: 'votre_secret_jwt_super_securise', // À remplacer par une vraie clé secrète en production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {} 