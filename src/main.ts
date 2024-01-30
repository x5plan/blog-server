import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { json as expressJSON } from "express";

import { AppModule } from "@/app.module";
import { ValidationErrorException } from "@/common/exception/validation-error.exception";
import { ConfigService } from "@/config/config.service";

async function bootstrapAsync() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix("api");
    app.useGlobalPipes(
        new ValidationPipe({
            always: true,
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            exceptionFactory: (errors) => new ValidationErrorException(errors),
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
