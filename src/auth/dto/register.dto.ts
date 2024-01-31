import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsUUID, Length } from "class-validator";

import { IsUsername } from "@/common/validators/username";
import type { UserBaseDetailDto } from "@/user/dto/user.dto";

export abstract class RegisterPostRequestBodyDto {
    @ApiProperty()
    @IsUsername()
    public readonly username: string;

    @ApiProperty()
    @IsEmail()
    public readonly email: string;

    @ApiProperty()
    @IsString()
    @Length(6, 32)
    public readonly password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public readonly emailVerificationCode: string;

    @ApiProperty()
    @IsUUID()
    public readonly registrationCode: string;
}

export abstract class RegisterPostResponseDto {
    public token: string;
    public userBaseDetail: UserBaseDetailDto;
}
