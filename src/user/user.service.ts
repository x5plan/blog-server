import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { UserBaseDetailDto, UserDetailDto } from "./dto/user.dto";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    public async findUserByIdAsync(id: number) {
        return await this.userRepository.findOne({ where: { id } });
    }

    public async findUserByUsernameAsync(username: string) {
        return await this.userRepository.findOne({ where: { username } });
    }

    public convertUserBaseDetail(user: UserEntity, currentUser?: UserEntity): UserBaseDetailDto {
        return {
            id: user.id,
            username: user.username,
            email: user.publicEmail || currentUser?.isAdmin ? user.email : null,
            nickname: user.nickname,
            isAdmin: user.isAdmin,
        };
    }

    public convertUserDetail(user: UserEntity, currentUser?: UserEntity): UserDetailDto {
        return {
            ...this.convertUserBaseDetail(user, currentUser),
            bio: user.bio,
        };
    }
}
