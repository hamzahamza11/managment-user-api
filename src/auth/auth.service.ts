import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      this.logger.log(`Validating user: ${email}`);
      
      // Verify the user exists
      const user = await this.usersService.findOne(email);
      if (!user) {
        this.logger.warn(`User not found: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for user: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify if user has permission for management_app
      this.logger.log(`Checking permissions for user ${user.id} on management_app`);
      
      const permissions = await this.permissionsRepository
        .createQueryBuilder('permission')
        .innerJoinAndSelect('permission.application', 'application')
        .where('permission.userId = :userId', { userId: user.id })
        .andWhere('application.name = :appName', { appName: 'management_app' })
        .getMany();
      
      if (permissions.length === 0) {
        this.logger.warn(`User ${email} has no permission for management_app`);
        throw new UnauthorizedException('No permission for management application');
      }

      // Get the highest permission level (admin takes precedence over viewer)
      const role = permissions.some(p => p.permissionType === 'admin') ? 'admin' : 'viewer';

      this.logger.log(`User ${email} successfully validated with role: ${role}`);
      const { password: _, ...result } = user;
      return { ...result, role };
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      name: user.name 
    };
    
    return {
      token: this.jwtService.sign(payload),
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
} 