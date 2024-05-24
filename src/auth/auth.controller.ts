import { Body, Controller, Delete, Get, Param, Post, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Recaptcha } from "@nestlab/google-recaptcha";

import { CurrentUser } from "@/common/decorators/user.decorator";
import type { CommonResultResponseDto } from "@/common/dtos/common-result.dto";
import { AuthRequiredException } from "@/common/exception/auth-required.exception";
import { PermissionDeniedException } from "@/common/exception/permission-denied.exception";
import { ConfigService } from "@/config/config.service";
import { CE_MailTemplate, MailService } from "@/mail/mail.service";
import type { UserEntity } from "@/user/user.entity";
import { UserService } from "@/user/user.service";

import {
    DuplicateEmailException,
    InvalidRegistrationCodeException,
    NoSuchUserException,
    RegistrationCodeAlreadyUsedException,
    WrongPasswordException,
} from "./auth.exception";
import { IRequestWithSession } from "./auth.middleware";
import { AuthService } from "./auth.service";
import { AuthSessionService } from "./auth-session.service";
import { AuthVerificationCodeService, CE_VerificationCodeType } from "./auth-verification-code.service";
import type { AccessTokenGetResponseDto } from "./dto/access-token.dto";
import { AccessTokenGetRequestQueryDto } from "./dto/access-token.dto";
import type { LoginPostResponseDto } from "./dto/login.dto";
import { LoginPostRequestBodyDto } from "./dto/login.dto";
import type { RegisterPostResponseDto } from "./dto/register.dto";
import { RegisterPostRequestBodyDto } from "./dto/register.dto";
import type { RegistrationCodeDto } from "./dto/registration-code.dto";
import {
    DeleteRegistrationCodeRequestParamsDto,
    GetRegistrationCodeListRequestQueryDto,
} from "./dto/registration-code.dto";
import { PostSendEmailVerificationCodeRequestBodyDto } from "./dto/send-email-verification-code.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly authSessionService: AuthSessionService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
        private readonly authVerificationCodeService: AuthVerificationCodeService,
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
                config: this.configService.getClientConfig(),
            };
        } else {
            return {
                userBaseDetail: null,
                config: this.configService.getClientConfig(),
            };
        }
    }

    @ApiOperation({
        summary: "A HTTP POST request to login.",
        description: "Recaptcha required.",
    })
    @Recaptcha()
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
    @ApiBearerAuth()
    @Post("logout")
    public async postLogoutAsync(@Req() req: IRequestWithSession): Promise<CommonResultResponseDto> {
        if (req.session?.sessionKey) {
            await this.authSessionService.endSessionAsync(req.session.sessionKey);
            return { success: true };
        }

        return { success: false };
    }

    @ApiOperation({
        summary: "A HTTP POST request to register a new user.",
        description: "Recaptcha required.",
    })
    @Recaptcha()
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

    @Post("sendEmailVerificationCodeForRegistration")
    @ApiOperation({
        summary: "A HTTP POST request to send an email verification code to register.",
        description: "Recaptcha required.",
    })
    @ApiBearerAuth()
    @Recaptcha()
    public async sendEmailVerificationCodeForRegistrationAsync(
        @Body() body: PostSendEmailVerificationCodeRequestBodyDto,
    ): Promise<CommonResultResponseDto> {
        if (await this.userService.checkEmailExistsAsync(body.email)) {
            throw new DuplicateEmailException();
        }

        const code = await this.authVerificationCodeService.generateAsync(CE_VerificationCodeType.Register, body.email);
        await this.mailService.sendMailAsync(CE_MailTemplate.RegisterVerificationCode, body.lang, { code }, body.email);

        return { success: true };
    }

    @ApiOperation({
        summary: "A HTTP POST request to create a new registration code.",
        description: "Auth required. Recaptcha required.",
    })
    @ApiBearerAuth()
    @Recaptcha()
    @Post("registrationCode")
    public async postCreateRegistrationCodeAsync(
        @CurrentUser() currentUser: UserEntity | null,
    ): Promise<RegistrationCodeDto> {
        if (!currentUser) {
            throw new AuthRequiredException();
        }

        const registrationCode = await this.authService.createNewRegistrationCodeAsync(currentUser);

        return await this.authService.convertRegistrationCodeDetailAsync(registrationCode, currentUser);
    }

    @ApiOperation({
        summary: "A HTTP GET request to get registration code list.",
        description: "Auth required. Recaptcha required.",
    })
    @ApiBearerAuth()
    @Delete("registrationCode/:code")
    public async deleteRegistrationCodeAsync(
        @CurrentUser() currentUser: UserEntity | null,
        @Param() param: DeleteRegistrationCodeRequestParamsDto,
    ): Promise<CommonResultResponseDto> {
        if (!currentUser) {
            throw new AuthRequiredException();
        }

        const registrationCodeEntity = await this.authService.findRegistrationCodeByCodeAsync(param.code);

        if (!registrationCodeEntity) {
            throw new InvalidRegistrationCodeException();
        }

        if (registrationCodeEntity.creatorId !== currentUser.id && !currentUser.isAdmin) {
            throw new PermissionDeniedException();
        }

        if (registrationCodeEntity.assignedUserId) {
            throw new RegistrationCodeAlreadyUsedException();
        }

        await this.authService.deleteRegistrationCodeAsync(registrationCodeEntity);

        return { success: true };
    }

    @ApiOperation({
        summary: "A HTTP GET request to get registration code list.",
        description: "Auth required. Recaptcha required.",
    })
    @ApiBearerAuth()
    @Recaptcha()
    @Get("registrationCodeList")
    public async getRegistrationCodeListAsync(
        @CurrentUser() currentUser: UserEntity | null,
        @Query() query: GetRegistrationCodeListRequestQueryDto,
    ): Promise<RegistrationCodeDto[]> {
        if (!currentUser) {
            throw new AuthRequiredException();
        }

        if (query.creatorId && query.creatorId !== currentUser.id && !currentUser.isAdmin) {
            throw new PermissionDeniedException();
        }

        const registrationCodeEntityList = await this.authService.findRegistrationCodeListByCreatorIdAsync(
            query.creatorId || currentUser.id,
        );

        return await Promise.all(
            registrationCodeEntityList.map((registrationCodeEntity) =>
                this.authService.convertRegistrationCodeDetailAsync(registrationCodeEntity, currentUser),
            ),
        );
    }
}
