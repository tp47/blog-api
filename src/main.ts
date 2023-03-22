import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as session from "express-session";
import { AppModule } from "./app.module";
import { Environment } from "./utils/consts";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(
    session({
      secret: config.get(Environment.SESSION_SECRET),
      resave: false,
      saveUninitialized: false,
    })
  )

  await app.listen(config.get(Environment.PORT));
}
bootstrap();
