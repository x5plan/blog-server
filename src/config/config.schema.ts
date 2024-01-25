import { Type } from "class-transformer";
import { IsIn, IsIP, IsNotEmpty, IsString, IsUrl, ValidateNested } from "class-validator";

import { IsPortNumber } from "@/common/validators/port-number";

class ServerConfig {
    @IsIP()
    public readonly hostname: string;

    @IsPortNumber()
    public readonly port: number;
}

export class DatabaseConfig {
    @IsIP()
    public readonly host: string;

    @IsPortNumber()
    public readonly port: number;

    @IsString()
    public readonly username: string;

    @IsString()
    public readonly password: string;

    @IsString()
    public readonly database: string;

    @IsIn(["mysql", "mariadb"])
    public readonly type: "mysql" | "mariadb";
}

class SecurityConfig {
    @IsString()
    @IsNotEmpty()
    public readonly sessionSecret: string;
}

export class AppConfig {
    @Type(() => ServerConfig)
    @ValidateNested()
    public readonly server: ServerConfig;

    @Type(() => DatabaseConfig)
    @ValidateNested()
    public readonly database: DatabaseConfig;

    @IsUrl({
        protocols: ["redis", "rediss", "redis-socket", "redis-sentinel"],
        require_protocol: true,
        require_host: true,
    })
    public readonly redis: string;

    @Type(() => SecurityConfig)
    @ValidateNested()
    public readonly security: SecurityConfig;
}
