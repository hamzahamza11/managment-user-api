import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UsersService);

  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  try {
    await usersService.create(
      'admin@example.com',
      hashedPassword,
      'admin',
      'Admin User'
    );
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }

  await app.close();
}

bootstrap(); 