import { Prisma } from "@prisma/client";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePostDto implements Prisma.PostCreateWithoutAuthorInput {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  viewCount?: number;

  @IsBoolean()
  published?: boolean;

  @IsString()
  content?: string;
}
/*
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String?
  published Boolean  @default(false)
  viewCount Int      @default(0)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)*/
