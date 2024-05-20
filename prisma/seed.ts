import { PrismaClient, RoleEnum } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@unacero.com',
    },
    update: {
      name: 'Admin',
      // password : Admin@1234
      password: '$2b$12$ZwpGuNErXpWaepgbLv0.guA6.B1kImLyUXVOnDZXfhUOViM0LsfoK',
      roles: {
        createMany: {
          skipDuplicates: true,
          data: [
            {
              id: '3',
              role: RoleEnum.USER,
            },
            {
              id: '2',
              role: RoleEnum.ADMIN,
            },
            {
              id: '1',
              role: RoleEnum.SUPER_ADMIN,
            },
          ],
        },
      },
    },
    create: {
      name: 'Admin',
      email: 'admin@unacero.com',
      password: '$2b$12$ZwpGuNErXpWaepgbLv0.guA6.B1kImLyUXVOnDZXfhUOViM0LsfoK',
      passwordUpdatedAt: new Date().toISOString(),
      roles: {
        create: [
          {
            id: '3',
            role: RoleEnum.USER,
          },
          {
            id: '2',
            role: RoleEnum.ADMIN,
          },
          {
            id: '1',
            role: RoleEnum.SUPER_ADMIN,
          },
        ],
      },
    },
  });
  console.log('Admin : ', admin);
}

main()
  .then(async () => {
    prisma.$disconnect();
  })
  .catch(async (err) => {
    console.log(err);
    prisma.$disconnect();
  });
