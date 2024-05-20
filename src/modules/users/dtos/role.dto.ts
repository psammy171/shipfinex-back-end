import { $Enums, RoleEnum } from '@prisma/client';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';

export class RoleDto {
  @IsString()
  @IsNotEmpty()
  id: '1' | '2';

  @IsEnum($Enums.RoleEnum)
  @IsNotEmpty()
  role: RoleEnum;
}
