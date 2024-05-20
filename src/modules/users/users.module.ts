import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UtilModule } from 'src/util/util.module';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  imports: [UtilModule],
  controllers: [UsersController],
})
export class UsersModule {}
