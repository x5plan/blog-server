import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import bcrypt from "bcrypt";
import { Repository } from "typeorm";

import { UserService } from "@/user/user.service";

import { AuthEntity } from "./auth.entity";
import { AuthSessionService } from "./auth-session.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthEntity)
        private readonly authRepository: Repository<AuthEntity>,
        private readonly userService: UserService,
        private readonly authSessionService: AuthSessionService,
    ) {}

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
}
