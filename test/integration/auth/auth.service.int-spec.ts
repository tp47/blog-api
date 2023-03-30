import { Test } from "@nestjs/testing";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { SignupDto } from "src/auth/dtos/signup.dto";
import { IncorrectPasswordException } from "src/auth/exceptions";
import { PrismaService } from "src/prisma/prisma.service";
import {
  UserExistsException,
  UserNotFoundException,
} from "src/user/exceptions";

describe("AuthService integration tests", () => {
  let prisma: PrismaService;
  let authService: AuthService;
  const dto: SignupDto = {
    email: "johndoe@test.com",
    userName: "john",
    password: "123456",
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    authService = moduleRef.get(AuthService);

    await prisma.cleanDatabase();
  });

  describe("signup method", () => {
    it("should signup", async () => {
      const user = await authService.signup(dto);
      expect(user).toMatchObject({
        email: dto.email,
        userName: dto.userName,
      });
    });

    it("should throw if email exists", async () => {
      try {
        await authService.signup({
          email: dto.email,
          userName: "john2",
          password: dto.password,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UserExistsException);
      }
    });

    it("should throw if username exists", async () => {
      try {
        await authService.signup({
          email: "johndoe2@test.com",
          userName: dto.userName,
          password: dto.password,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UserExistsException);
      }
    });
  });

  describe("signin method", () => {
    it("should signin", async () => {
      const user = await authService.signin({
        userName: dto.userName,
        password: dto.password,
      });
      expect(user).toMatchObject({
        email: dto.email,
        userName: dto.userName,
      });
    });

    it("should throw if username is incorrect", async () => {
      try {
        await authService.signin({
          userName: "john2",
          password: dto.password,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UserNotFoundException);
      }
    });

    it("should throw if password is incorrect", async () => {
      try {
        await authService.signin({
          userName: dto.userName,
          password: "123123",
        });
      } catch (error) {
        expect(error).toBeInstanceOf(IncorrectPasswordException);
      }
    });
  });
});
