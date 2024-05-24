import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export abstract class ListQueryDto {
    @ApiProperty()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    public readonly skipCount: number;

    @ApiProperty()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    public readonly takeCount: number;
}
