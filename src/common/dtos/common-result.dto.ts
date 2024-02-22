import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CommonResultResponseDto {
    @ApiProperty()
    public success: boolean;

    @ApiPropertyOptional()
    public message?: string;
}
