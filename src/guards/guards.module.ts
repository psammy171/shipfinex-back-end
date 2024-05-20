import { Module } from '@nestjs/common';
import { UserGuard } from './user.guard';
import { AdminGuard } from './admin.guard';
import { SuperAdminGuard } from './super-admin.guard';

@Module({
  providers: [UserGuard, AdminGuard, SuperAdminGuard],
})
export class GuardsModule {}
