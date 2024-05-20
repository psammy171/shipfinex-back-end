import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest() as Request;
      const user = request['user'];
      if (!user) throw new UnauthorizedException();
      if (
        user.roles &&
        user.roles.find((role: any) => role.role === RoleEnum.SUPER_ADMIN)
      )
        return true;
      throw new UnauthorizedException();
    } catch (err: any) {
      throw new UnauthorizedException();
    }
  }
}
