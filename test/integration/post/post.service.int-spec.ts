import { Test } from "@nestjs/testing";
import { Prisma } from "@prisma/client";
import {CreatePostDto} from "src/post/dtos/create-post.dto";
import { PostModule } from "src/post/post.module";
import { PostService } from "src/post/post.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "src/user/dtos/create-user.dto";
import {
  UserExistsException,
  UserNotFoundException,
} from "src/user/exceptions";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";

describe("PostService integration tests", () => {
  let prisma: PrismaService;
  let userService: UserService;
  let postService: PostService;
  let userId: number;
  const userCreateData: Prisma.UserCreateInput = {
    email: "johndoe@test.com",
    userName: "john",
    hash: "abcdef",
  };
  let postId: number;
  const postCreateData: CreatePostDto = {
    title: "Lorem ipsum",
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule, PostModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    userService = moduleRef.get(UserService);
    postService = moduleRef.get(PostService);

    await prisma.cleanDatabase();
    ({ id: userId } = await userService.createUser(userCreateData));
  });

  describe("createPost method", () => {
    it("should create post", async () => {
      const post = await postService.createPost(postCreateData, userId);
      postId = post.id;
      expect(post).toMatchObject({
        id: postId,
        title: postCreateData.title,
        authorId: userId,
      });
    });

    it("should throw if related user not found", async () => {
      try {
        await postService.createPost(postCreateData, -1)
      } catch (error) {
        expect(error).toBeInstanceOf(UserNotFoundException);
      }
    });
  });

  //describe("getUniquePost method", () => {
    //it("should get unique post by id", async () => {
      //const post = await postService.getUniquePost({ id: postId });
      //expect(post).toMatchObject({
        //id: userId,
        //email: userData.email,
        //userName: userData.userName,
      //});
    //});

    //it("should get unique user by email", async () => {
      //const user = await userService.getUniqueUser({ email: userData.email });
      //expect(user).toMatchObject({
        //id: userId,
        //email: userData.email,
        //userName: userData.userName,
      //});
    //});

    //it("should get unique user by username", async () => {
      //const user = await userService.getUniqueUser({
        //userName: userData.userName,
      //});
      //expect(user).toMatchObject({
        //id: userId,
        //email: userData.email,
        //userName: userData.userName,
      //});
    //});

    //it("should throw if id does not exist", async () => {
      //try {
        //await userService.getUniqueUser({
          //id: 0,
        //});
      //} catch (error) {
        //expect(error).toBeInstanceOf(UserNotFoundException);
      //}
    //});

    //it("should throw if email does not exist", async () => {
      //try {
        //await userService.getUniqueUser({
          //email: "janedoe@test.com",
        //});
      //} catch (error) {
        //expect(error).toBeInstanceOf(UserNotFoundException);
      //}
    //});

    //it("should throw if username does not exist", async () => {
      //try {
        //await userService.getUniqueUser({
          //userName: "jane",
        //});
      //} catch (error) {
        //expect(error).toBeInstanceOf(UserNotFoundException);
      //}
    //});
  //});

  //describe("getAllUsers method", () => {
  //it("should get all users", async () => {
  //const users = await userService.getAllUsers({});
  //expect(users[0]).toMatchObject(userData);
  //});

  //it("should get empty array if take param equals 0", async () => {
  //const users = await userService.getAllUsers({ take: 0 });
  //expect(users).toEqual([]);
  //});

  //it("should get empty array if where param does not satisfy the condition", async () => {
  //const users = await userService.getAllUsers({ where: { id: 0 } });
  //expect(users).toEqual([]);
  //});
  //});

  //describe("updateUser method", () => {
  //it("should update user", async () => {
  //const user = await userService.updateUser({
  //where: { id: userId },
  //data: { firstName: userData.userName },
  //});
  //expect(user).toMatchObject({
  //firstName: userData.userName,
  //});
  //});

  //it("should throw if user is not found", async () => {
  //try {
  //await userService.updateUser({
  //where: { id: 0 },
  //data: { firstName: userData.userName },
  //});
  //} catch (error) {
  //expect(error).toBeInstanceOf(UserNotFoundException);
  //}
  //});
  //});
  //describe("deleteUser method", () => {
  //it("should delete user", async () => {
  //const user = await userService.deleteUser({ id: userId });
  //expect(user).toMatchObject(userData);
  //});

  //it("should throw if user is not found", async () => {
  //try {
  //await userService.deleteUser({ id: 0 });
  //} catch (error) {
  //expect(error).toBeInstanceOf(UserNotFoundException);
  //}
  //});
});
