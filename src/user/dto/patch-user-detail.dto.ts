import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsInt, IsOptional, IsString, MaxLength } from "class-validator";

import type { IPatchRequestBody } from "@/common/utils/types";
import { IsUsername } from "@/common/validators/username";

import { UserDetailDto } from "./user.dto";

export abstract class PatchUserDetailParamDto {
    @ApiProperty()
    @IsInt()
    @Type(() => Number)
    public readonly id: number;
}

export abstract class PatchUserDetailBodyDto implements IPatchRequestBody<UserDetailDto> {
    @ApiPropertyOptional()
    @IsUsername()
    @IsOptional()
    public readonly username?: string;

    @ApiPropertyOptional()
    @IsEmail()
    @IsOptional()
    public readonly email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(24)
    public readonly nickname?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public readonly bio?: string;
}

export abstract class PatchUserDetailResponseDto extends UserDetailDto {}
