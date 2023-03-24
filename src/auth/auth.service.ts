import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as argon2 from "argon2";
import { SignupDto } from "./dtos/signup.dto";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signup(dto: SignupDto) {
    try {
      const hash = await argon2.hash(dto.password);
      const user = await this.userService.createUser({
        email: dto.email,
        userName: dto.userName,
        hash,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
}
