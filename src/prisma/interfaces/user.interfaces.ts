import { Prisma, User } from "@prisma/client";

export type UserWithoutHash = Omit<User, "hash">;

export interface UserGetAllParams {
  skip?: number;
  take?: number;
  cursor?: Prisma.UserWhereUniqueInput;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
}
