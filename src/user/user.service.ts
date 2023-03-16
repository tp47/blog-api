import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
  UserGetAllParams,
  UserUpdateParams,
  UserWithoutHash,
} from "src/prisma/interfaces";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUniqueUser(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<UserWithoutHash | null> {
    const user = await this.prisma.user.findUnique({
      where,
    });
    return this.prisma.exclude(user, ["hash"]);
  }

  async getAllUsers(params: UserGetAllParams): Promise<UserWithoutHash[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const users = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    return users.map((user) => this.prisma.exclude(user, ["hash"]));
  }

  async createUser(data: Prisma.UserCreateInput): Promise<UserWithoutHash> {
    const user = await this.prisma.user.create({
      data,
    });
    return this.prisma.exclude(user, ["hash"]);
  }

  async updateUser(params: UserUpdateParams): Promise<UserWithoutHash> {
    const { where, data } = params;
    const user = await this.prisma.user.update({
      data,
      where,
    });
    return this.prisma.exclude(user, ["hash"]);
  }

  async deleteUser(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<UserWithoutHash> {
    const user = await this.prisma.user.delete({
      where,
    });
    return this.prisma.exclude(user, ["hash"]);
  }
}
