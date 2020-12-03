import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account } from '../account/account.entity';
import { serveConfig } from '../../common';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  getToken({ id, username, type }: Account) {
    return this.jwtService.sign({ [`key-${serveConfig.jwt.secret}`]: id, username, type });
  }
}
