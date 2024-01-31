import { ApiProperty } from "@nestjs/swagger";

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
