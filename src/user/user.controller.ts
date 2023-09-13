import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDTO } from '../db/dtos/loginDto';
import { UserDTO } from 'src/db/dtos/userDto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   *
   * Creates user and returns an object containing token as JWT token to be used for authentication
   *
   * @param dto - type: UserDTO
   * @returns any
   */
  @Post('/createUser')
  createUser(@Body() dto: UserDTO) {
    return this.userService.createUser(dto);
  }

  /**
   *
   * Login the user and returns an object containing token as JWT token to be used for authentication
   *
   * @param dto - type: LoginDTO
   * @returns any
   */
  @Post('/login')
  login(@Body() dto: LoginDTO) {
    return this.userService.login(dto);
  }
}
