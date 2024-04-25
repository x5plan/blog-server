import { Type } from "class-transformer";
import {
    IsBoolean,
    IsEmail,
    IsIn,
    IsInt,
    IsIP,
    IsNotEmpty,
    IsNotEmptyObject,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    ValidateNested,
} from "class-validator";

import { IsHostname } from "@/common/validators/hostname";
import { IsPortNumber } from "@/common/validators/port-number";
import { IsUsername } from "@/common/validators/username";

class ServerConfig {
    @IsIP()
    public readonly hostname: string;

    @IsPortNumber()
    public readonly port: number;
}

class DatabaseConfig {
    @IsHostname({
        require_tld: false,
    })
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

class MailConfig {
    @IsEmail()
    @IsOptional()
    public readonly address: string;

    @IsUrl({
        protocols: ["smtp", "smtps"],
        require_protocol: true,
        require_host: true,
        require_tld: false,
    })
    public readonly transport: string;
}

class RateLimitSecurityConfig {
    @IsBoolean()
    public readonly enabled: boolean;

    @IsInt()
    @IsOptional()
    public readonly maxRequests: number;

    @IsInt()
    @IsOptional()
    public readonly durationSeconds: number;
}

class CrossOriginSecurityConfig {
    @IsBoolean()
    public readonly enabled: boolean;

    @IsUrl(
        {
            protocols: ["http", "https"],
            require_protocol: true,
            require_host: true,
            require_tld: false,
        },
        {
            each: true,
        },
    )
    public readonly whitelist: string[];
}

class RecaptchaSecurityConfig {
    @IsBoolean()
    public readonly enabled: boolean;

    @IsString()
    @IsOptional()
    public readonly secretKey: string;

    @IsString()
    @IsOptional()
    public readonly siteKey: string;

    @IsBoolean()
    public readonly useRecaptchaNet: boolean;
}

class SecurityConfig {
    @IsString()
    @IsNotEmpty()
    public readonly sessionSecret: string;

    @Type(() => RateLimitSecurityConfig)
    @ValidateNested()
    @IsNotEmptyObject()
    public readonly rateLimit: RateLimitSecurityConfig;

    @Type(() => CrossOriginSecurityConfig)
    @ValidateNested()
    @IsNotEmptyObject()
    public readonly crossOrigin: CrossOriginSecurityConfig;

    @Type(() => RecaptchaSecurityConfig)
    @ValidateNested()
    @IsNotEmptyObject()
    public readonly recaptcha: RecaptchaSecurityConfig;
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
    @IsString()
    @IsNotEmpty()
    public readonly appName: string;

    @Type(() => ServerConfig)
    @ValidateNested()
    @IsNotEmptyObject()
    public readonly server: ServerConfig;

    @Type(() => DatabaseConfig)
    @ValidateNested()
    @IsNotEmptyObject()
    public readonly database: DatabaseConfig;

    @Type(() => MailConfig)
    @ValidateNested()
    @IsNotEmptyObject()
    public readonly mail: MailConfig;

    @IsUrl({
        protocols: ["redis", "rediss", "redis-socket", "redis-sentinel"],
        require_protocol: true,
        require_host: true,
        require_tld: false,
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
