import type { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { forwardRef, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MailModule } from "@/mail/mail.module";
import { RedisModule } from "@/redis/redis.module";
import { UserModule } from "@/user/user.module";

import { AuthController } from "./auth.controller";
import { AuthEntity } from "./auth.entity";
import { AuthMiddleware } from "./auth.middleware";
import { AuthService } from "./auth.service";
import { AuthSessionService } from "./auth-session.service";
import { AuthVerificationCodeService } from "./auth-verification-code.service";
import { RegistrationCodeEntity } from "./registration-code.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([AuthEntity]),
        TypeOrmModule.forFeature([RegistrationCodeEntity]),
        forwardRef(() => RedisModule),
        forwardRef(() => MailModule),
        forwardRef(() => UserModule),
    ],
    providers: [AuthService, AuthSessionService, AuthVerificationCodeService],
    exports: [AuthService, AuthSessionService, AuthVerificationCodeService],
    controllers: [AuthController],
})
export class AuthModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AuthMiddleware).forRoutes({
            path: "*",
            method: RequestMethod.ALL,
        });
    }
}
