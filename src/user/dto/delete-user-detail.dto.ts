import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export abstract class DeleteUserDetailParamDto {
    @ApiProperty()
    @IsInt()
    @Type(() => Number)
    public readonly id: number;
}
