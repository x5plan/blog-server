import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { IsUsername } from "@/common/validators/username";
import { UserBaseDetailDto } from "@/user/dto/user.dto";

export abstract class LoginPostRequestBodyDto {
    @ApiProperty()
    @IsUsername()
    public username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public password: string;
}

export abstract class LoginPostResponseDto {
    @ApiProperty()
    public token: string;

    @ApiProperty()
    public userBaseDetail: UserBaseDetailDto;
}
