import { Controller, Get, Post, Delete, Body, Param, UseGuards, Logger } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users/:userId/permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  private readonly logger = new Logger(PermissionsController.name);

  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  findAllByUserId(@Param('userId') userId: string) {
    this.logger.log(`Getting all permissions for user ID: ${userId}`);
    return this.permissionsService.findAllByUserId(+userId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  addPermission(
    @Param('userId') userId: string,
    @Body() permissionDto: { applicationId: number; permissionType: string },
  ) {
    this.logger.log(`Adding permission for user ID: ${userId} - Application ID: ${permissionDto.applicationId}`);
    console.log("permissionDto" , permissionDto);
    return this.permissionsService.addPermission(
      +userId,
      permissionDto.applicationId,
      permissionDto.permissionType,
    );
  }

  @Delete(':applicationId')
  @UseGuards(RolesGuard)
  @Roles('admin')
  removePermission(
    @Param('userId') userId: string,
    @Param('applicationId') applicationId: string,
  ) {
    this.logger.log(`Removing permission for user ID: ${userId} - Application ID: ${applicationId}`);
    return this.permissionsService.removePermission(+userId, +applicationId);
  }
} 