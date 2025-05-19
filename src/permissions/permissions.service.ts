import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { UsersService } from '../users/users.service';
import { ApplicationsService } from '../applications/applications.service';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);

  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    private usersService: UsersService,
    private applicationsService: ApplicationsService,
  ) {}

  async findAll(): Promise<Permission[]> {
    return this.permissionsRepository.find({
      relations: ['user', 'application']
    });
  }

  async findAllByUserId(userId: number): Promise<Permission[]> {
    this.logger.log(`Getting all permissions for user ID: ${userId}`);
    
    // Verify user exists
    await this.usersService.findById(userId);
    
    return this.permissionsRepository.find({
      where: { userId },
      relations: ['application'],
    });
  }

  async addPermission(
    userId: number,
    applicationId: number,
    permissionType: string,
  ): Promise<Permission> {
    this.logger.log(`Adding permission for user ID: ${userId} on application ID: ${applicationId}`);
    
    // Validate permission type
    if (permissionType !== 'admin' && permissionType !== 'viewer') {
      throw new BadRequestException('Permission type must be either "admin" or "viewer"');
    }
    
    // Verify user exists
    await this.usersService.findById(userId);
    
    // Verify application exists
    await this.applicationsService.findOne(applicationId);
    
    // Check if permission already exists
    const existingPermission = await this.permissionsRepository.findOne({
      where: { userId, applicationId },
    });
    
    if (existingPermission) {
      // Update existing permission
      existingPermission.permissionType = permissionType;
      return this.permissionsRepository.save(existingPermission);
    }
    
    // Create new permission
    const newPermission = this.permissionsRepository.create({
      userId,
      applicationId,
      permissionType,
    });
    
    return this.permissionsRepository.save(newPermission);
  }

  async removePermission(userId: number, applicationId: number): Promise<void> {
    this.logger.log(`Removing permission for user ID: ${userId} on application ID: ${applicationId}`);
    
    const permission = await this.permissionsRepository.findOne({
      where: { userId, applicationId },
    });
    
    if (!permission) {
      throw new NotFoundException(`Permission for user ID ${userId} on application ID ${applicationId} not found`);
    }
    
    await this.permissionsRepository.remove(permission);
  }

  async create(createPermissionDto: { userId: number; applicationId: number; permissionType: string }): Promise<Permission> {
    // Validate permission type
    if (createPermissionDto.permissionType !== 'admin' && createPermissionDto.permissionType !== 'viewer') {
      throw new BadRequestException('Permission type must be either "admin" or "viewer"');
    }

    // Verify user exists
    await this.usersService.findById(createPermissionDto.userId);
    
    // Verify application exists
    await this.applicationsService.findOne(createPermissionDto.applicationId);

    // Check if permission already exists
    const existingPermission = await this.permissionsRepository.findOne({
      where: { 
        userId: createPermissionDto.userId, 
        applicationId: createPermissionDto.applicationId 
      },
    });

    if (existingPermission) {
      // Update existing permission
      existingPermission.permissionType = createPermissionDto.permissionType;
      return this.permissionsRepository.save(existingPermission);
    }

    // Create new permission
    const permission = this.permissionsRepository.create(createPermissionDto);
    return this.permissionsRepository.save(permission);
  }

  async remove(userId: number, applicationId: number): Promise<void> {
    const result = await this.permissionsRepository.delete({
      userId,
      applicationId
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Permission not found`);
    }
  }
} 