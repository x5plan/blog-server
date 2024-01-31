import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "@/common/decorators/user.decorator";
import { AuthRequiredException } from "@/common/exception/auth-required.exception";
import { UserEntity } from "@/user/user.entity";
import { UserService } from "@/user/user.service";

import { NoSuchUserException, WrongPasswordException } from "./auth.exception";
import { IRequestWithSession } from "./auth.middleware";
import { AuthService } from "./auth.service";
import { AuthSessionService } from "./auth-session.service";
import type { AccessTokenGetResponseDto } from "./dto/access-token.dto";
import { AccessTokenGetRequestQueryDto } from "./dto/access-token.dto";
import type { LoginPostResponseDto } from "./dto/login.dto";
import { LoginPostRequestBodyDto } from "./dto/login.dto";
import type { RegisterPostResponseDto } from "./dto/register.dto";
import { RegisterPostRequestBodyDto } from "./dto/register.dto";
import type { RegistrationCodeDto } from "./dto/registration-code.dto";

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

    @ApiOperation({
        summary: "A HTTP POST request to logout.",
        description: "Auth required.",
    })
    @Post("logout")
    public async postLogoutAsync() {}

    @ApiOperation({
        summary: "A HTTP POST request to register a new user.",
    })
    @Post("register")
    public async postRegisterAsync(
        @Req() req: IRequestWithSession,
        @Body() body: RegisterPostRequestBodyDto,
    ): Promise<RegisterPostResponseDto> {
        const { username, password, email, emailVerificationCode, registrationCode } = body;

        const user = await this.authService.createNewUserAsync(
            username,
            password,
            email,
            emailVerificationCode,
            registrationCode,
        );

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

    @ApiOperation({
        summary: "A HTTP POST request to create a new registration code.",
        description: "Auth required.",
    })
    @ApiBearerAuth()
    @Post("createRegistrationCode")
    public async postCreateRegistrationCodeAsync(@CurrentUser() currentUser: UserEntity): Promise<RegistrationCodeDto> {
        if (!currentUser) {
            throw new AuthRequiredException();
        }

        const registrationCode = await this.authService.createNewRegistrationCodeAsync(currentUser);

        return await this.authService.convertRegistrationCodeDetailAsync(registrationCode, currentUser);
    }
}
