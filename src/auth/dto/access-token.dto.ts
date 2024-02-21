import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

import { AppClientConfigDto } from "@/config/client-config.dto";
import type { UserBaseDetailDto } from "@/user/dto/user.dto";

export abstract class AccessTokenGetRequestQueryDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    public token?: string;
}

export abstract class AccessTokenGetResponseDto {
    @ApiProperty()
    public userBaseDetail: UserBaseDetailDto | null;

    @ApiProperty()
    public config: AppClientConfigDto;
}
