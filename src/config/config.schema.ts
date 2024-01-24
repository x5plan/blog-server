import { Type } from "class-transformer";
import { IsIP, IsNotEmpty, IsString, ValidateNested } from "class-validator";

import { IsPortNumber } from "@/common/validators/port-number";

class ServerConfig {
    @IsIP()
    public readonly hostname: string;

    @IsPortNumber()
    public readonly port: number;
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

    @Type(() => SecurityConfig)
    @ValidateNested()
    public readonly security: SecurityConfig;
}
