import { HttpException, HttpStatus } from "@nestjs/common";

export class UserExists extends HttpException {
  constructor() {
    super(
      "User with provided credentials already exists",
      HttpStatus.BAD_REQUEST,
    );
  }
}
