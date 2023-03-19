import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { UserGetAllParams, UserUpdateParams } from "src/prisma/interfaces";
import { PrismaService } from "src/prisma/prisma.service";
import { UserExistsException, UserNotFoundException } from "./exceptions";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUniqueUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where,
    });
    if (user === null) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async getAllUsers(params: UserGetAllParams): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const users = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    if (users === null) {
      throw new UserNotFoundException();
    }
    return users;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data,
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new UserExistsException();
        }
      }
      throw error;
    }
  }

  async updateUser(params: UserUpdateParams): Promise<User> {
    try {
      const { where, data } = params;
      const user = await this.prisma.user.update({
        data,
        where,
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new UserNotFoundException();
        }
      }
      throw error;
    }
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    try {
      const user = await this.prisma.user.delete({
        where,
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new UserNotFoundException();
        }
      }
      throw error;
    }
  }
}
