import { HttpException, HttpStatus } from "@nestjs/common";

export class IncorrectPasswordException extends HttpException {
  constructor() {
    super("Credentials are incorrect", HttpStatus.BAD_REQUEST);
  }
}
