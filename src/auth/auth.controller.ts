import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Session,
  UseInterceptors,
} from "@nestjs/common";
import { UserEntity } from "src/utils/entities";
import { AuthService } from "./auth.service";
import { SigninDto } from "./dtos";
import { SignupDto } from "./dtos/signup.dto";
import { UserSession } from "./interfaces";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post("signup")
  async signup(
    @Body() dto: SignupDto,
    @Session() session: UserSession,
  ): Promise<UserEntity> {
    const user = await this.authService.signup(dto);
    const userEntity = new UserEntity(user);
    session.user = userEntity;
    return userEntity;
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post("signin")
  async signin(
    @Body() dto: SigninDto,
    @Session() session: UserSession,
  ): Promise<UserEntity> {
    const user = await this.authService.signin(dto);
    const userEntity = new UserEntity(user);
    session.user = userEntity;
    return userEntity;
  }
}
