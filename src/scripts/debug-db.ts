import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User } from '../users/entities/user.entity';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

async function debugDatabase() {
  const app = await NestFactory.create(AppModule);
  console.log('Application started');

  try {
    // Get the DataSource
    const dataSource = app.get<DataSource>(getDataSourceToken());
    console.log('Connected to database');

    // Get user repository
    const userRepository = dataSource.getRepository(User);
    
    // Count users
    const userCount = await userRepository.count();
    console.log(`Total users in database: ${userCount}`);
    
    // List all users
    const users = await userRepository.find();
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    // Check database schema
    console.log('Database schema for users table:');
    const schema = await userRepository.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'users\'');
    console.log(schema);
    
  } catch (error) {
    console.error('Error connecting to database:', error.message);
    console.error(error.stack);
  } finally {
    await app.close();
  }
}

debugDatabase(); 