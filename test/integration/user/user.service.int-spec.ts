import { Test } from "@nestjs/testing";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import {
  UserExistsException,
  UserNotFoundException,
} from "src/user/exceptions";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";

describe("UserService integration tests", () => {
  let prisma: PrismaService;
  let userService: UserService;
  let userId: number;
  const userData: Prisma.UserCreateInput = {
    email: "johndoe@test.com",
    userName: "john",
    hash: "abcdef",
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    userService = moduleRef.get(UserService);

    await prisma.cleanDatabase();
  });

  describe("createUser method", () => {
    it("should create user", async () => {
      const user = await userService.createUser(userData);
      userId = user.id;
      expect(user).toMatchObject({
        email: userData.email,
        userName: userData.userName,
      });
    });

    it("should throw if email is not unique", async () => {
      try {
        await userService.createUser({
          email: userData.email,
          userName: "jane",
          hash: userData.hash,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UserExistsException);
      }
    });

    it("should throw if username is not unique", async () => {
      try {
        await userService.createUser({
          email: "janedoe@test.com",
          userName: userData.userName,
          hash: userData.hash,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UserExistsException);
      }
    });
  });

  describe("getUniqueUser method", () => {
    it("should get unique user by id", async () => {
      const user = await userService.getUniqueUser({ id: userId });
      expect(user).toMatchObject({
        id: userId,
        email: userData.email,
        userName: userData.userName,
      });
    });

    it("should get unique user by email", async () => {
      const user = await userService.getUniqueUser({ email: userData.email });
      expect(user).toMatchObject({
        id: userId,
        email: userData.email,
        userName: userData.userName,
      });
    });

    it("should get unique user by username", async () => {
      const user = await userService.getUniqueUser({
        userName: userData.userName,
      });
      expect(user).toMatchObject({
        id: userId,
        email: userData.email,
        userName: userData.userName,
      });
    });

    it("should throw if id does not exist", async () => {
      try {
        await userService.getUniqueUser({
          id: 0,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UserNotFoundException);
      }
    });

    it("should throw if email does not exist", async () => {
      try {
        await userService.getUniqueUser({
          email: "janedoe@test.com",
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UserNotFoundException);
      }
    });

    it("should throw if username does not exist", async () => {
      try {
        await userService.getUniqueUser({
          userName: "jane",
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UserNotFoundException);
      }
    });
  });

  describe("getAllUsers method", () => {
    it("should get all users", async () => {
      const users = await userService.getAllUsers({});
      expect(users[0]).toMatchObject(userData);
    });

    it("should get empty array if take param equals 0", async () => {
      const users = await userService.getAllUsers({ take: 0 });
      expect(users).toEqual([]);
    });

    it("should get empty array if where param does not satisfy the condition", async () => {
      const users = await userService.getAllUsers({ where: { id: 0 } });
      expect(users).toEqual([]);
    });
  });

  describe("updateUser method", () => {
    it("should update user", async () => {
      const user = await userService.updateUser({
        where: { id: userId },
        data: { firstName: userData.userName },
      });
      expect(user).toMatchObject({
        firstName: userData.userName,
      });
    });

    it("should throw if user is not found", async () => {
      try {
        await userService.updateUser({
          where: { id: 0 },
          data: { firstName: userData.userName },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UserNotFoundException);
      }
    });
  });
  describe("deleteUser method", () => {
    it("should delete user", async () => {
      const user = await userService.deleteUser({ id: userId });
      expect(user).toMatchObject(userData);
    });

    it("should throw if user is not found", async () => {
      try {
        await userService.deleteUser({ id: 0 });
      } catch (error) {
        expect(error).toBeInstanceOf(UserNotFoundException);
      }
    });
  });
});
