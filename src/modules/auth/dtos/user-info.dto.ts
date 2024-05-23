import { IsString, MinLength } from 'class-validator';

export class UserInfoDto {
  @IsString()
  @MinLength(3)
  name: string;
}
