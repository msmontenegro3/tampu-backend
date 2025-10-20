import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt')) // protege esta ruta
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user; // devuelve el usuario autenticado
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
