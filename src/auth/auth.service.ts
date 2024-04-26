import type { OnApplicationBootstrap } from "@nestjs/common";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import bcrypt from "bcrypt";
import { DataSource, IsNull, MoreThanOrEqual, Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { ConfigService } from "@/config/config.service";
import { UserEntity } from "@/user/user.entity";
import { UserService } from "@/user/user.service";

import { AuthEntity } from "./auth.entity";
import {
    DuplicateEmailException,
    DuplicateUsernameException,
    InvalidEmailVerificationCodeException,
    InvalidRegistrationCodeException,
} from "./auth.exception";
import { AuthVerificationCodeService, CE_VerificationCodeType } from "./auth-verification-code.service";
import type { RegistrationCodeDto } from "./dto/registration-code.dto";
import { RegistrationCodeEntity } from "./registration-code.entity";

const REGISTRATION_CODE_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 30; // 30 days

@Injectable()
export class AuthService implements OnApplicationBootstrap {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        @InjectRepository(AuthEntity)
        private readonly authRepository: Repository<AuthEntity>,
        @InjectRepository(RegistrationCodeEntity)
        private readonly registrationCodeRepository: Repository<RegistrationCodeEntity>,
        @Inject(forwardRef(() => AuthVerificationCodeService))
        private readonly authVerificationCodeService: AuthVerificationCodeService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @Inject(forwardRef(() => ConfigService))
        private readonly configService: ConfigService,
    ) {}

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public async onApplicationBootstrap(): Promise<void> {
        // Create root user if not exists
        if (!(await this.userService.findUserByIdAsync(1))) {
            const { adminUsername, adminPassword, adminEmail } = this.configService.config.initialization;
            const user = await this.createNewUserAsync(
                adminUsername,
                adminPassword,
                adminEmail,
                "" /* verificationCode */,
                "" /* registrationCode */,
                true /* skipCodeCheck */,
            );
            user.isAdmin = true;
            await this.dataSource.getRepository(UserEntity).save(user);
        }
    }

    public async changePasswordAsync(auth: AuthEntity, password: string): Promise<void> {
        auth.password = await this.hashPasswordAsync(password);
        await this.authRepository.save(auth);
    }

    private async hashPasswordAsync(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public async checkPasswordAsync(auth: AuthEntity, password: string): Promise<boolean> {
        return await bcrypt.compare(password, auth.password);
    }

    public async createNewUserAsync(
        username: string,
        password: string,
        email: string,
        verificationCode: string,
        registrationCode: string,
        skipCodeCheck: boolean = false,
    ): Promise<UserEntity> {
        let user: UserEntity | null = null;
        let auth: AuthEntity | null = null;
        let registrationCodeEntity: RegistrationCodeEntity | null = null;

        if (
            !skipCodeCheck &&
            !(await this.authVerificationCodeService.verifyAsync(
                CE_VerificationCodeType.Register,
                email,
                verificationCode,
            ))
        ) {
            throw new InvalidEmailVerificationCodeException();
        }

        try {
            await this.dataSource.transaction("READ COMMITTED", async (manager) => {
                user = new UserEntity();
                user.username = username;
                user.email = email;
                await manager.save(user);

                auth = new AuthEntity();
                auth.userId = user.id;
                auth.password = await this.hashPasswordAsync(password);
                await manager.save(auth);

                if (!skipCodeCheck) {
                    registrationCodeEntity = await manager.findOne(RegistrationCodeEntity, {
                        where: {
                            code: registrationCode,
                            assignedUserId: IsNull(),
                            expireDate: MoreThanOrEqual(new Date()),
                        },
                    });

                    if (!registrationCodeEntity) {
                        throw new InvalidRegistrationCodeException();
                    }

                    registrationCodeEntity.assignedUserId = user.id;
                    await manager.save(registrationCodeEntity);

                    await this.authVerificationCodeService.revokeAsync(
                        CE_VerificationCodeType.Register,
                        email,
                        verificationCode,
                    );
                }
            });

            return user as unknown as UserEntity;
        } catch (e) {
            if (e instanceof InvalidRegistrationCodeException) {
                throw e;
            }

            if (!skipCodeCheck && !registrationCodeEntity) {
                throw new InvalidRegistrationCodeException();
            }

            if (await this.userService.checkUsernameExistsAsync(username)) {
                throw new DuplicateUsernameException();
            }

            if (await this.userService.checkEmailExistsAsync(email)) {
                throw new DuplicateEmailException();
            }

            throw e;
        }
    }

    public async createNewRegistrationCodeAsync(creator: UserEntity): Promise<RegistrationCodeEntity> {
        const registrationCodeEntity = new RegistrationCodeEntity();
        registrationCodeEntity.creatorId = creator.id;
        registrationCodeEntity.code = uuidv4();
        registrationCodeEntity.expireDate = new Date(Date.now() + REGISTRATION_CODE_EXPIRE_TIME);

        return await this.registrationCodeRepository.save(registrationCodeEntity);
    }

    public async deleteRegistrationCodeAsync(registrationCodeEntity: RegistrationCodeEntity): Promise<void> {
        await this.registrationCodeRepository.remove(registrationCodeEntity);
    }

    public async findRegistrationCodeByCodeAsync(code: string): Promise<RegistrationCodeEntity | null> {
        return await this.registrationCodeRepository.findOne({ where: { code } });
    }

    public async findRegistrationCodeListByCreatorIdAsync(creatorId: number): Promise<RegistrationCodeEntity[]> {
        return await this.registrationCodeRepository.find({ where: { creatorId } });
    }

    public async convertRegistrationCodeDetailAsync(
        registrationCodeEntity: RegistrationCodeEntity,
        currentUser?: UserEntity,
    ): Promise<RegistrationCodeDto> {
        const creatorUserEntity = await registrationCodeEntity.creatorPromise;
        const assignedUserEntity = registrationCodeEntity.assignedUserId
            ? await registrationCodeEntity.assignedUserPromise
            : null;

        return {
            registrationCode: registrationCodeEntity.code,
            expireDate: registrationCodeEntity.expireDate,
            creator: creatorUserEntity && this.userService.convertUserBaseDetail(creatorUserEntity, currentUser),
            assignedUser: assignedUserEntity && this.userService.convertUserBaseDetail(assignedUserEntity, currentUser),
        };
    }
}
