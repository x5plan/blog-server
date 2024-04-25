import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn } from "class-validator";

import { CE_Language, languages } from "@/common/locales";

export abstract class PostSendEmailVerificationCodeRequestBodyDto {
    @ApiProperty()
    @IsEmail()
    public readonly email: string;

    @ApiProperty()
    @IsIn(languages)
    public readonly lang: CE_Language;
}
