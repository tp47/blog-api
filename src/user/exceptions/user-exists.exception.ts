import { HttpException, HttpStatus } from "@nestjs/common";

export class UserExistsException extends HttpException {
  constructor() {
    super(
      "User with provided credentials already exists",
      HttpStatus.BAD_REQUEST,
    );
  }
}
