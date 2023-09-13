import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDTO } from '../db/dtos/loginDto';
import { UserDTO } from 'src/db/dtos/userDto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/createUser')
  createUser(@Body() dto: UserDTO) {
    return this.userService.createUser(dto);
  }

  @Post('/login')
  login(@Body() dto: LoginDTO) {
    return this.userService.login(dto);
  }
}
