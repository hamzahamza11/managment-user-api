import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    
    this.logger.log(`Finding user with email: ${email}`);
    return this.usersRepository.findOne({ 
      where: { 
        email,
        is_active: true 
      } 
    });
  }

  async create(email: string, password: string, role: string, name?: string): Promise<User> {
    this.logger.log(`Creating user with email: ${email}, role: ${role}, name: ${name || 'not provided'}`);
    
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    if (!password) {
      throw new BadRequestException('Password is required');
    }
    if (!role) {
      throw new BadRequestException('Role is required');
    }

    // Ensure name is never null
    const userName = name || `User_${Date.now()}`;

    try {
      const existingUser = await this.findOne(email);
      if (existingUser) {
        this.logger.warn(`User with email ${email} already exists`);
        throw new BadRequestException('Email already exists');
      }

      this.logger.log('Creating user entity');
      const user = this.usersRepository.create({ 
        email, 
        password, 
        role,
        name: userName,
        is_active: true 
      });
      
      this.logger.log('Saving user to database');
      const savedUser = await this.usersRepository.save(user);
      this.logger.log(`User saved with ID: ${savedUser.id}`);
      
      return savedUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw error;
    }
  }
} 