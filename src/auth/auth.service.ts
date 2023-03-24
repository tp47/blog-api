import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as argon2 from "argon2";
import { SignupDto } from "./dtos/signup.dto";
import { SigninDto } from "./dtos";
import { IncorrectPassword } from "./exceptions";

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

  async signin(dto: SigninDto) {
    try {
      const user = await this.userService.getUniqueUser({
        userName: dto.userName,
      });
      if (await argon2.verify(user.hash, dto.password)) {
        return user;
      } else {
        throw new IncorrectPassword();
      }
    } catch (error) {
      throw error;
    }
  }
}
