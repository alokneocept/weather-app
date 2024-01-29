import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(user: User): Promise<User> {
    try {
    user.password = await bcrypt.hash(user.password, 10);
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async getUserByUserId(userid: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { userid } });
    } catch (error) {
      this.logger.error(`Error getting user by ID: ${error.message}`, error.stack);
      throw new Error(`Error getting user by ID: ${error.message}`);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      this.logger.error(`Error getting all users: ${error.message}`, error.stack);
      throw new Error(`Error getting all users: ${error.message}`);
    }
  }

  async deleteUser(userid: string): Promise<boolean> {
    try {
      const userToDelete = await this.userRepository.findOne({ where: { userid } });

      if (!userToDelete) {
        return false;
      }

      await this.userRepository.remove(userToDelete);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting user: ${error.message}`, error.stack);
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  async updateUser(userid: string, updatedUser: Partial<User>): Promise<User | null> {
    try {
      const userToUpdate = await this.userRepository.findOne({ where: { userid } });

      if (!userToUpdate) {
        return null;
      }
      if (updatedUser.password) {
        updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
      }

      Object.assign(userToUpdate, updatedUser);

      return await this.userRepository.save(userToUpdate);
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async signIn(userid: string, password: string): Promise<User | null> {
    try {
    const user = await this.userRepository.findOne({ where: { userid } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    return user;
  }
  catch (error) {
    this.logger.error(`Error during sign-in: ${error.message}`);
    throw new Error('Internal server error during sign-in');
  }
}
}
