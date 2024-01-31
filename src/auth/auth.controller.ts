import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { UserService } from "@/user/user.service";

import { NoSuchUserException, WrongPasswordException } from "./auth.exception";
import { IRequestWithSession } from "./auth.middleware";
import { AuthService } from "./auth.service";
import { AuthSessionService } from "./auth-session.service";
import type { AccessTokenGetResponseDto } from "./dto/access-token.dto";
import { AccessTokenGetRequestQueryDto } from "./dto/access-token.dto";
import type { LoginPostResponseDto } from "./dto/login.dto";
import { LoginPostRequestBodyDto } from "./dto/login.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly authSessionService: AuthSessionService,
        private readonly userService: UserService,
    ) {}

    @ApiOperation({
        summary: "A HTTP GET request to access a token, response with user base detail if token is valid.",
    })
    @Get("accessToken")
    public async postAccessTokenAsync(
        @Query() query: AccessTokenGetRequestQueryDto,
    ): Promise<AccessTokenGetResponseDto> {
        const { token } = query;

        if (token) {
            const [, user] = await this.authSessionService.accessSessionAsync(token);
            return {
                userBaseDetail: user && this.userService.convertUserBaseDetail(user),
            };
        } else {
            return {
                userBaseDetail: null,
            };
        }
    }

    @ApiOperation({
        summary: "A HTTP POST request to login.",
    })
    @Post("login")
    public async postLoginAsync(
        @Req() req: IRequestWithSession,
        @Body() body: LoginPostRequestBodyDto,
    ): Promise<LoginPostResponseDto> {
        const { username, password } = body;

        const user = await this.userService.findUserByUsernameAsync(username);
        if (!user) {
            throw new NoSuchUserException();
        }

        const auth = await user.authPromise;
        if (!auth) {
            throw new NoSuchUserException();
        }

        const isPasswordCorrect = await this.authService.checkPasswordAsync(auth, password);
        if (!isPasswordCorrect) {
            throw new WrongPasswordException();
        }

        const sessionKey = await this.authSessionService.newSessionAsync(
            user,
            req.ip as string,
            req.headers["user-agent"] as string,
        );

        return {
            token: sessionKey,
            userBaseDetail: this.userService.convertUserBaseDetail(user),
        };
    }

    @Post("logout")
    public async postLogoutAsync() {}

    @Post("register")
    public async postRegisterAsync() {}

    @Post("createRegisterCode")
    @ApiBearerAuth()
    public async postRequestRegisterCodeAsync() {}
}
