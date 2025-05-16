import { Controller, Post, Get, Body, UseGuards, UnauthorizedException, HttpCode, HttpStatus, Request, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      this.logger.log(`Login attempt for email: ${loginDto.email}`);
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      return this.authService.login(user);
    } catch (error) {
      this.logger.error(`Login failed for email: ${loginDto.email}`, error.stack);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('signup')
  async signup(@Body() signupDto: { name?: string; email: string; password: string; role?: string }) {
    try {
      this.logger.log(`Signup attempt for email: ${signupDto.email}`);
      
      // Validation
      if (!signupDto.email) {
        throw new BadRequestException('Email is required');
      }
      if (!signupDto.password) {
        throw new BadRequestException('Password is required');
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(signupDto.password, 10);
      this.logger.log('Password hashed successfully');
      
      // Default role to 'viewer' if not provided
      const role = signupDto.role || 'viewer';
      
      // Create the user (name can be null, will be handled by the service)
      this.logger.log(`Creating user with email: ${signupDto.email}, role: ${role}`);
      const user = await this.usersService.create(
        signupDto.email,
        hashedPassword,
        role,
        signupDto.name
      );
      
      this.logger.log(`User created successfully with ID: ${user.id}`);
      
      // Remove password from response
      const { password, ...result } = user;
      
      return result;
    } catch (error) {
      this.logger.error(`Signup failed for email: ${signupDto.email}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not create user: ' + error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  getAdminData() {
    return { message: 'This data is only available to admins' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'viewer')
  @Get('all-users')
  getAllUsersData() {
    return { message: 'This data is available to both admins and viewers' };
  }
} 