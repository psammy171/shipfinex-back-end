import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { MailService } from './mail/mail.service';

@Module({
  providers: [PrismaService, MailService],
  exports: [PrismaService, MailService],
})
export class UtilModule {}
