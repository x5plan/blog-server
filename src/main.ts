import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { json as expressJSON } from "express";

import { AppModule } from "@/app.module";
import { ValidationErrorException } from "@/common/exception/validation-error.exception";
import { ConfigService } from "@/config/config.service";
import { ErrorFilter } from "@/error.filter";

import { RecaptchaFilter } from "./recaptcha/recaptcha.filter";

async function bootstrapAsync() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageInfo = require("../package.json");

    Logger.log(`Starting X5Plan Blog version ${packageInfo.version}`, "Bootstrap");

    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix("api");
    app.useGlobalFilters(app.get(ErrorFilter), app.get(RecaptchaFilter));
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

    if (configService.config.security.crossOrigin.enabled) {
        app.enableCors({
            origin: configService.config.security.crossOrigin.whitelist,
            optionsSuccessStatus: 200,
            maxAge: 7200,
        });
    }

    Logger.log(`Setting up Swagger API document builder`, "Bootstrap");
    const document = SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
            .setTitle("X5Plan Blog")
            .setDescription(packageInfo.description)
            .setVersion(packageInfo.version)
            .addBearerAuth()
            .build(),
    );
    SwaggerModule.setup("/docs", app, document);

    await app.listen(configService.config.server.port, configService.config.server.hostname);

    Logger.log(
        `X5Plan Blog is listening on ${configService.config.server.hostname}:${configService.config.server.port}`,
        "Bootstrap",
    );
}

bootstrapAsync().catch((e) => {
    Logger.error(e, "App");
});
