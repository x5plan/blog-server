import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { Recaptcha } from "@nestlab/google-recaptcha";

import { CurrentUser } from "@/common/decorators/user.decorator";
import type { CommonResultResponseDto } from "@/common/dtos/common-result.dto";
import { AuthRequiredException } from "@/common/exception/auth-required.exception";
import { PermissionDeniedException } from "@/common/exception/permission-denied.exception";
import { hasOneOfKeys } from "@/common/utils/value-checkers";

import {
    DeleteUserDetailParamDto,
    GetUserDetailParamDto,
    type GetUserDetailResponseDto,
    PatchUserDetailBodyDto,
    PatchUserDetailParamDto,
    type PatchUserDetailResponseDto,
} from "./dto";
import { UserEntity } from "./user.entity";
import { DuplicateEmailException, DuplicateUsernameException, NoSuchUserException } from "./user.exception";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({
        summary: "A HTTP GET request to get a user list.",
    })
    @Get("/list")
    public async getUserListAsync() {
        // TODO: Implement this method
    }

    @ApiOperation({
        summary: "A HTTP DELETE request to delete a user.",
        description: "Recaptcha required.",
    })
    @Recaptcha()
    @Delete("/detail/:id")
    public async deleteUserDetailAsync(
        @CurrentUser() currentUser: UserEntity,
        @Param() param: DeleteUserDetailParamDto,
    ): Promise<CommonResultResponseDto> {
        if (!currentUser) {
            throw new AuthRequiredException();
        }

        const { id } = param;
        const user = await this.userService.findUserByIdAsync(id);
        if (!user) {
            throw new NoSuchUserException();
        }

        if (currentUser.id !== user.id && !currentUser.isAdmin) {
            throw new PermissionDeniedException();
        }

        await this.userService.deleteUserAsync(user);

        return { success: true };
    }

    @ApiOperation({
        summary: "A HTTP GET request to get a user detail.",
    })
    @Get("/detail/:id")
    public async getUserDetailAsync(
        @CurrentUser() currentUser: UserEntity,
        @Param() param: GetUserDetailParamDto,
    ): Promise<GetUserDetailResponseDto> {
        const { id } = param;
        const user = await this.userService.findUserByIdAsync(id);
        if (!user) {
            throw new NoSuchUserException();
        }

        return this.userService.convertUserDetail(user, currentUser);
    }

    @ApiOperation({
        summary: "A HTTP PATCH request to update a user detail.",
        description: "Recaptcha required.",
    })
    @Recaptcha()
    @Patch("/detail/:id")
    public async patchUserDetailAsync(
        @CurrentUser() currentUser: UserEntity,
        @Param() param: PatchUserDetailParamDto,
        @Body() body: PatchUserDetailBodyDto,
    ): Promise<PatchUserDetailResponseDto> {
        if (!currentUser) {
            throw new AuthRequiredException();
        }

        const { id } = param;
        const user = await this.userService.findUserByIdAsync(id);

        if (!user) {
            throw new NoSuchUserException();
        }

        if (currentUser.id !== user.id && !currentUser.isAdmin) {
            throw new PermissionDeniedException();
        }

        if (hasOneOfKeys(body, "username", "email")) {
            if (!currentUser.isAdmin) {
                throw new PermissionDeniedException();
            }

            if (await this.userService.checkUsernameExistsAsync(body.username!)) {
                throw new DuplicateUsernameException();
            }

            if (await this.userService.checkEmailExistsAsync(body.email!)) {
                throw new DuplicateEmailException();
            }
        }

        const data = this.userService.convertPatchUserDetailDtoToUserEntity(body);
        await this.userService.updateUserByIdAsync(id, data);

        return this.userService.convertUserDetail({ ...user, ...data }, currentUser);
    }
}
