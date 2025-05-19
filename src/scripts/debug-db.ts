import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { PermissionsService } from '../permissions/permissions.service';
import { ApplicationsService } from '../applications/applications.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const permissionsService = app.get(PermissionsService);
  const applicationsService = app.get(ApplicationsService);

  try {
    // Get all users
    const users = await usersService.findAll();
    console.log('\nUsers:');
    for (const user of users) {
      console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
      
      // Get user's permissions
      const permissions = await permissionsService.findAllByUserId(user.id);
      if (permissions.length > 0) {
        console.log('  Permissions:');
        for (const permission of permissions) {
          const app = await applicationsService.findOne(permission.applicationId);
          console.log(`  - ${app.name}: ${permission.permissionType}`);
        }
      } else {
        console.log('  No permissions');
      }
    }

    // Get all applications
    const applications = await applicationsService.findAll();
    console.log('\nApplications:');
    for (const app of applications) {
      console.log(`- ID: ${app.id}, Name: ${app.name}, Description: ${app.description}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await app.close();
  }
}

bootstrap(); 