import { ApiProperty } from "@nestjs/swagger";

export abstract class UserBaseDetailDto {
    @ApiProperty()
    public readonly id: number;

    @ApiProperty()
    public username: string;

    @ApiProperty({ nullable: true })
    public email: string | null;

    @ApiProperty({ nullable: true })
    public nickname: string | null;

    @ApiProperty()
    public isAdmin: boolean;
}

export abstract class UserDetailDto extends UserBaseDetailDto {
    @ApiProperty({ nullable: true })
    public bio: string | null;
}
