import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }

  exclude<T, Key extends keyof T>(model: T, keys: Key[]): Omit<T, Key> {
    for (const key of keys) {
      delete model[key];
    }
    return model;
  }

  cleanDatabase(): Promise<Prisma.BatchPayload[]> {
    if (process.env.NODE_ENV === "production") return;
    return this.$transaction([this.post.deleteMany(), this.user.deleteMany()]);
  }
}
