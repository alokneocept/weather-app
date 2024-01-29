// user.controller.ts
import { Body, Controller, Get, Param, Post,Put,Delete, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() user: User): Promise<User> {
    try {
      return await this.userService.createUser(user);
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  @Get(':userid')
  async getUserByUserId(@Param('userid') userid: string): Promise<User> {
    try {
      return await this.userService.getUserByUserId(userid);
    } catch (error) {
      this.logger.error(`Error getting user by ID: ${error.message}`, error.stack);
      throw new Error(`Error getting user by ID: ${error.message}`);
    }
  }

  @Get('users')
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      this.logger.error(`Error getting all users: ${error.message}`, error.stack);
      throw new Error(`Error getting all users: ${error.message}`);
    }
  }

  @Delete(':userid')
  async deleteUser(@Param('userid') userid: string): Promise<boolean> {
    try {
      return await this.userService.deleteUser(userid);
    } catch (error) {
      this.logger.error(`Error deleting user: ${error.message}`, error.stack);
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  @Put(':userid')
  async updateUser(@Param('userid') userid: string, @Body() updatedUser: Partial<User>): Promise<User | null> {
    try {
      return await this.userService.updateUser(userid, updatedUser);
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  @Post('signin')
  async signIn(@Body() credentials: { userid: string; password: string }): Promise<User | null> {
    try {
      return await this.userService.signIn(credentials.userid, credentials.password);
    } catch (error) {
      this.logger.error(`Error signing in: ${error.message}`);
      throw new Error(`Error signing in: ${error.message}`);
    }
  }
}

