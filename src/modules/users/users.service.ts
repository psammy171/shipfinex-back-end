import { Injectable } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from 'src/util/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
      },
    });
  }

  async addAdminRole(userId: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        roles: {
          upsert: {
            where: {
              id_userId: {
                id: '2',
                userId: userId,
              },
            },
            create: {
              id: '2',
              role: RoleEnum.ADMIN,
            },
            update: {
              role: RoleEnum.ADMIN,
            },
          },
        },
      },
    });
    return [
      {
        id: '2',
        role: RoleEnum.ADMIN,
        userId: userId,
      },
    ];
  }

  async addSuperAdminRole(userId: string) {
    await Promise.all([
      this.addAdminRole(userId),
      this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          roles: {
            upsert: {
              where: {
                id_userId: {
                  id: '1',
                  userId: userId,
                },
              },
              create: {
                id: '1',
                role: RoleEnum.SUPER_ADMIN,
              },
              update: {
                role: RoleEnum.SUPER_ADMIN,
              },
            },
          },
        },
      }),
    ]);
    return [
      {
        id: '2',
        role: RoleEnum.ADMIN,
        userId: userId,
      },
      {
        id: '1',
        role: RoleEnum.SUPER_ADMIN,
        userId: userId,
      },
    ];
  }

  async removeRole(role: RoleEnum, id: string) {
    const roleIds = [];
    switch (role) {
      case 'ADMIN':
        roleIds.push('1', '2');
        break;
      case 'SUPER_ADMIN':
        roleIds.push('1');
    }
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        roles: {
          deleteMany: {
            id: {
              in: roleIds,
            },
          },
        },
      },
    });
    return {
      message: 'Roles updated',
    };
  }
}
