import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt } from "class-validator";

import { UserDetailDto } from "./user.dto";

export abstract class GetUserDetailParamDto {
    @ApiProperty()
    @IsInt()
    @Type(() => Number)
    public readonly id: number;
}

export abstract class GetUserDetailResponseDto extends UserDetailDto {}
