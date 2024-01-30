import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

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
}
