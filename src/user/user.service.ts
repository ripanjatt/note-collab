import { Injectable, UnauthorizedException } from '@nestjs/common';

import { getJWT, verifyHash } from 'src/utils/utils';
import { LoginDTO } from '../db/dtos/loginDto';
import { createUserInDB, getUser } from 'src/db/crud';
import { UserDTO } from 'src/db/dtos/userDto';

@Injectable()
export class UserService {
  async createUser(dto: UserDTO) {
    const userId = await createUserInDB(dto);

    return {
      token: getJWT(userId),
      message: 'User created successfully',
    };
  }

  async login(dto: LoginDTO) {
    const user = await getUser({ email: dto.email });

    if (user) {
      const isValid = await verifyHash(user.password, dto.password);
      if (isValid) {
        return {
          token: getJWT(user.userId),
          message: 'Login successful',
        };
      }
    }
    throw new UnauthorizedException('Incorrect email or password!');
  }
}
