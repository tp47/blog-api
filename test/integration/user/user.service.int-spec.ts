import { Test } from "@nestjs/testing";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";

describe("UserService integration tests", () => {
  let prisma: PrismaService;
  let userService: UserService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    userService = moduleRef.get(UserService);

    await prisma.cleanDatabase();
  });

  describe("createUser", () => {
    const createUserData: Prisma.UserCreateInput = {
      email: "johndoe@test.com",
      userName: "john",
      hash: "abcdef",
    };

    it("should create user", async () => {
      const user = await userService.createUser(createUserData);
      expect(user).toMatchObject({
        email: createUserData.email,
        userName: createUserData.userName,
      });
    });

    it("should throw if email is not unique", async () => {
      try {
        await userService.createUser({
          email: createUserData.email,
          userName: "jane",
          hash: createUserData.hash,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
        expect(error).toHaveProperty("code", "P2002");
      }
    });

    it("should throw if username is not unique", async () => {
      try {
        await userService.createUser({
          email: "janedoe@test.com",
          userName: createUserData.userName,
          hash: createUserData.hash,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
        expect(error).toHaveProperty("code", "P2002");
      }
    });
  });
});
