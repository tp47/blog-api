import { Injectable } from "@nestjs/common";
import { Post, Prisma } from "@prisma/client";
import {
  PostGetAllParams,
  PostUpdateParams,
} from "src/prisma/interfaces/post.interfaces";
import { PrismaService } from "src/prisma/prisma.service";
import {UserNotFoundException} from "src/user/exceptions";
import { PostNotFoundException } from "./exceptions";
import { PostExistsException } from "./exceptions/post-exists.exception";

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async getUniquePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where,
    });
    if (post === null) {
      throw new PostNotFoundException();
    }
    return post;
  }

  async getAllPosts(params: PostGetAllParams): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const posts = await this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    return posts;
  }

  async createPost(
    data: Prisma.PostCreateWithoutAuthorInput,
    userId: number,
  ): Promise<Post> {
    try {
      const post = await this.prisma.post.create({
        data: {
          ...data,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return post;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new PostExistsException();
        }
        if (error.code === "P2025") {
          throw new UserNotFoundException();
        }
      }
      throw error;
    }
  }

  async updatePost(params: PostUpdateParams): Promise<Post> {
    try {
      const { where, data } = params;
      const post = await this.prisma.post.update({
        data,
        where,
      });
      return post;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new PostNotFoundException();
        }
      }
      throw error;
    }
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    try {
      const post = await this.prisma.post.delete({
        where,
      });
      return post;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new PostNotFoundException();
        }
      }
      throw error;
    }
  }
}
