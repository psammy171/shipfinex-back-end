import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UtilModule } from 'src/util/util.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UtilModule],
})
export class AuthModule {}
