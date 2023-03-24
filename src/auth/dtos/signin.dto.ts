import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";

export class SigninDto {
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @IsNotEmpty()
  userName: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
