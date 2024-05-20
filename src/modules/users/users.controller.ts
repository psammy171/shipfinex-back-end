import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserGuard } from 'src/guards/user.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { RoleDto } from './dtos/role.dto';
import { SuperAdminGuard } from 'src/guards/super-admin.guard';

@UseGuards(AdminGuard)
@UseGuards(UserGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(SuperAdminGuard)
  @Post('/roles/add')
  addRole(@Body() body: RoleDto) {
    switch (body.role) {
      case 'ADMIN':
        return this.usersService.addAdminRole(body.id);
      case 'SUPER_ADMIN':
        return this.usersService.addSuperAdminRole(body.id);
    }
    return;
  }

  @UseGuards(SuperAdminGuard)
  @Post('/roles/remove')
  removeRole(@Body() body: RoleDto) {
    return this.usersService.removeRole(body.role, body.id);
  }
}
