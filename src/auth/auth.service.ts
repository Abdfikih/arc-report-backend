import { Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async authenticate(email: string, password: string) {
    try {
      const user = await this.userService.validateUser(email, password);

      const token = jwt.sign(
        {
          uid: user.id,
        },
        process.env.SECRET_JWT,
        {
          expiresIn: '7d',
        },
      );
      const key = user.password;
      return { token, key };
    } catch (err) {
      throw err;
    }
  }
}
