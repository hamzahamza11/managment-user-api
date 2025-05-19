import { Controller, Post, Get, Body, UseGuards, UnauthorizedException, HttpCode, HttpStatus, Request, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { email: string; password: string }) {
    this.logger.log(`Login attempt for user: ${loginDto.email}`);
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    return this.authService.login(user);
  }

  @Post('signup')
  async signup(@Body() signupDto: { name: string; email: string; password: string }) {
    this.logger.log(`Signup attempt for user: ${signupDto.email}`);
    
    try {
      // Create the user
      const user = await this.usersService.create(signupDto);
      
      // Return the user without password
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      this.logger.error(`Error during signup: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

} 