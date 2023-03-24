import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Session,
  UseInterceptors,
} from "@nestjs/common";
import { UserEntity } from "src/utils/entities";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dtos/signup.dto";
import { UserSession } from "./interfaces";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("signup")
  async signup(
    @Body() dto: SignupDto,
    @Session() session: UserSession,
  ): Promise<UserEntity> {
    const user = await this.authService.signup(dto);
    session.user = user;

    return new UserEntity(user);
  }
}
