import { Prisma } from "@prisma/client";

export interface PostGetAllParams {
  skip?: number;
  take?: number;
  cursor?: Prisma.PostWhereUniqueInput;
  where?: Prisma.PostWhereInput;
  orderBy?: Prisma.PostOrderByWithRelationInput;
}

export interface PostUpdateParams {
  where: Prisma.PostWhereUniqueInput;
  data: Prisma.PostUpdateInput;
}
