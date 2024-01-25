import type { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { forwardRef, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RedisModule } from "@/redis/redis.module";
import { UserModule } from "@/user/user.module";

import { AuthEntity } from "./auth.entity";
import { AuthMiddleware } from "./auth.middleware";
import { AuthSessionService } from "./auth-session.service";

@Module({
    imports: [TypeOrmModule.forFeature([AuthEntity]), forwardRef(() => RedisModule), forwardRef(() => UserModule)],
    providers: [AuthSessionService],
    exports: [AuthSessionService],
})
export class AuthModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AuthMiddleware).forRoutes({
            path: "*",
            method: RequestMethod.ALL,
        });
    }
}
