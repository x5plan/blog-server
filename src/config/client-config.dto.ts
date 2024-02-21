import { ApiProperty } from "@nestjs/swagger";

export abstract class AppClientConfigDto {
    @ApiProperty()
    public appName: string;

    @ApiProperty()
    public recaptchaEnabled: boolean;

    @ApiProperty()
    public recaptchaSiteKey: string;

    @ApiProperty()
    public useRecaptchaNet: boolean;
}
