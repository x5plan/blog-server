import { ApiProperty } from "@nestjs/swagger";

import { ListQueryDto } from "@/common/dtos/list-query.dto";

import type { UserDetailDto } from "./user.dto";

export abstract class GetUserListRequestQueryDto extends ListQueryDto {}

export abstract class GetUserListResponseDto {
    @ApiProperty()
    public count: number;

    @ApiProperty()
    public users: UserDetailDto[];
}
