import { forwardRef, Module } from "@nestjs/common";

import { AuthModule } from "@/auth/auth.module";
import { ConfigModule } from "@/config/config.module";
import { DatabaseModule } from "@/database/database.module";
import { RedisModule } from "@/redis/redis.module";
import { UserModule } from "@/user/user.module";

@Module({
    imports: [
        ConfigModule,
        forwardRef(() => AuthModule),
        forwardRef(() => DatabaseModule),
        forwardRef(() => RedisModule),
        forwardRef(() => UserModule),
    ],
})
export class AppModule {}
