import { Type } from "class-transformer";
import {
    IsEmail,
    IsIn,
    IsIP,
    IsNotEmpty,
    IsNotEmptyObject,
    IsString,
    IsUrl,
    Length,
    ValidateNested,
} from "class-validator";

import { IsPortNumber } from "@/common/validators/port-number";
import { IsUsername } from "@/common/validators/username";

class ServerConfig {
    @IsIP()
    public readonly hostname: string;

    @IsPortNumber()
    public readonly port: number;
}

class DatabaseConfig {
    @IsIP()
    public readonly host: string;

    @IsPortNumber()
    public readonly port: number;

    @IsString()
    @IsNotEmpty()
    public readonly username: string;

    @IsString()
    @IsNotEmpty()
    public readonly password: string;

    @IsString()
    @IsNotEmpty()
    public readonly database: string;

    @IsIn(["mysql", "mariadb"])
    public readonly type: "mysql" | "mariadb";
}

class SecurityConfig {
    @IsString()
    @IsNotEmpty()
    public readonly sessionSecret: string;
}

class InitializationConfig {
    @IsUsername()
    public readonly adminUsername: string;

    @IsString()
    @Length(6, 32)
    public readonly adminPassword: string;

    @IsEmail()
    public readonly adminEmail: string;
}

export class AppConfig {
    @Type(() => ServerConfig)
    @ValidateNested()
    @IsNotEmptyObject()
    public readonly server: ServerConfig;

    @Type(() => DatabaseConfig)
    @ValidateNested()
    @IsNotEmptyObject()
    public readonly database: DatabaseConfig;

    @IsUrl({
        protocols: ["redis", "rediss", "redis-socket", "redis-sentinel"],
        require_protocol: true,
        require_host: true,
    })
    public readonly redis: string;

    @Type(() => SecurityConfig)
    @ValidateNested()
    @IsNotEmptyObject()
    public readonly security: SecurityConfig;

    @Type(() => InitializationConfig)
    @ValidateNested()
    @IsNotEmptyObject()
    public readonly initialization: InitializationConfig;
}
