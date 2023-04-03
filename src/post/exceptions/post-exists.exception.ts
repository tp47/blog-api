import { HttpException, HttpStatus } from "@nestjs/common";

export class PostExistsException extends HttpException {
  constructor() {
    super(
      "Post with provided credentials already exists",
      HttpStatus.BAD_REQUEST,
    );
  }
}
