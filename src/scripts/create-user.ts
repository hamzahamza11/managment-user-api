import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

async function createUser() {
  const app = await NestFactory.create(AppModule);
  console.log('Application started');

  try {
    const usersService = app.get(UsersService);
    console.log('UsersService initialized');

    // Test data
    const name = 'Test User';
    const email = 'test@example.com';
    const password = 'test123';
    const role = 'viewer';

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');

    // Create the user
    console.log(`Creating user with email: ${email}`);
    const user = await usersService.create(
      email,
      hashedPassword,
      role,
      name
    );
    
    console.log('User created successfully:');
    console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    
  } catch (error) {
    console.error('Error creating user:', error.message);
    console.error(error.stack);
  } finally {
    await app.close();
  }
}

createUser(); 