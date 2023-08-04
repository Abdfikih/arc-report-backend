import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    console.log(body);
    try {
      console.log(
        'authenticating : ',
        await this.authService.authenticate(body.email, body.password),
      );
      return await this.authService.authenticate(body.email, body.password);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('register')
  async register(@Body() body: Prisma.UserCreateInput) {
    try {
      return await this.userService.create(body);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get('getallusers')
  async findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('logout')
  async logout() {
    return { message: 'logout' };
  }

  @Post('verify-token')
  @UseGuards(AuthGuard)
  async verifyToken() {
    return true;
  }

  @Post('verify-admin')
  @UseGuards(AuthGuard)
  async verifyAdmin() {
    return true;
  }
}
