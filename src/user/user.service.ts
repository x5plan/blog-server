import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { PatchUserDetailBodyDto } from "./dto/patch-user-detail.dto";
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

    public async findUserListAsync(
        skipCount: number,
        takeCount: number,
    ): Promise<{
        count: number;
        users: UserEntity[];
    }> {
        const [users, count] = await this.userRepository.findAndCount({
            order: {
                id: "ASC",
            },
            skip: skipCount,
            take: takeCount,
        });

        return {
            count,
            users,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async deleteUserAsync(user: UserEntity) {
        // TODO: Delete user
    }

    public async updateUserByIdAsync(id: number, data: Partial<UserEntity>) {
        return await this.userRepository.update(id, data);
    }

    public async checkUsernameExistsAsync(username: string) {
        return !!(await this.userRepository.count({ where: { username } }));
    }

    public async checkEmailExistsAsync(email: string) {
        return !!(await this.userRepository.count({ where: { email } }));
    }

    public convertUserBaseDetail(user: UserEntity, currentUser?: UserEntity): UserBaseDetailDto {
        return {
            id: user.id,
            username: user.username,
            email: user.publicEmail || currentUser?.isAdmin || currentUser?.id === user.id ? user.email : null,
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

    public convertPatchUserDetailDtoToUserEntity(dto: PatchUserDetailBodyDto): Partial<UserEntity> {
        return {
            username: dto.username,
            nickname: dto.nickname,
            bio: dto.bio,
        };
    }
}
