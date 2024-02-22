import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

import { UserBaseDetailDto } from "@/user/dto/user.dto";

export class RegistrationCodeDto {
    @ApiProperty()
    public registrationCode: string;

    @ApiProperty()
    public expireDate: Date;

    @ApiProperty()
    public creator: UserBaseDetailDto;

    @ApiProperty({ nullable: true })
    public assignedUser: UserBaseDetailDto | null;
}

export class DeleteRegistrationCodeRequestParamsDto {
    @ApiProperty()
    @IsString()
    public readonly code: string;
}

export class GetRegistrationCodeListRequestQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    public readonly creatorId?: number;
}
