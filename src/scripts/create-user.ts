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
    // Create user
    const user = await usersService.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123'
    });

    // Get management app
    const managementApp = await applicationsService.findOne('management_app');

    // Create permission
    await permissionsService.create({
      userId: user.id,
      applicationId: managementApp.id,
      permissionType: 'viewer'
    });

    console.log(`User created successfully:`);
    console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
    console.log(`Permission: viewer for management_app`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await app.close();
  }
}

bootstrap(); 