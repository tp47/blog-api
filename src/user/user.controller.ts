import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Session,
  UnauthorizedException,
  UseInterceptors,
} from "@nestjs/common";
import { UserSession } from "src/auth/interfaces";
import { UserEntity } from "src/utils/entities";

@Controller("user")
export class UserController {
  @UseInterceptors(ClassSerializerInterceptor)
  @Get("me")
  getMe(@Session() session: UserSession) {
    if (!session.user) {
      throw new UnauthorizedException("Not authenticated");
    }
    return new UserEntity(session.user);
  }
}
