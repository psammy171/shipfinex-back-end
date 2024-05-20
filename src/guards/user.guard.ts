import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest() as Request;
      const authHeader = request.header('Authorization') as string;
      if (!authHeader) throw new UnauthorizedException();
      const token = authHeader.split(' ')[1];
      if (!token) throw new UnauthorizedException();
      jwt.verify(token, process.env.JWT_SECRET);
      const user = jwt.decode(token);
      request['user'] = user;
      return true;
    } catch (err: any) {
      throw new UnauthorizedException();
    }
  }
}
