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
    // Create admin user
    const adminUser = await usersService.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123'
    });

    // Get management app
    const managementApp = await applicationsService.findOne('management_app');

    // Create admin permission
    await permissionsService.create({
      userId: adminUser.id,
      applicationId: managementApp.id,
      permissionType: 'admin'
    });

    console.log('Admin user created successfully:');
    console.log(`ID: ${adminUser.id}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Name: ${adminUser.name}`);
    console.log('Permission: admin for management_app');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await app.close();
  }
}

bootstrap(); 