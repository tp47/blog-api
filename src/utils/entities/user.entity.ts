import { Exclude } from "class-transformer";
import { User } from "@prisma/client";

export class UserEntity implements User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  userName: string;

  @Exclude()
  hash: string;

  role: string;
  birthAt: Date | null;
  firstName: string | null;
  lastName: string | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

