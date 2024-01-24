import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { json as expressJSON } from "express";

import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";

async function bootstrapAsync() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix("api");
    app.useGlobalPipes(
        new ValidationPipe({
            always: true,
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
    app.use(expressJSON({ limit: "50mb" }));

    const configService = app.get(ConfigService);

    await app.listen(configService.config.server.port, configService.config.server.hostname);

    Logger.log(
        `X5Plan Blog is listening on ${configService.config.server.hostname}:${configService.config.server.port}`,
        "Bootstrap",
    );
}
bootstrapAsync();
