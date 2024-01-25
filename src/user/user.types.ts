export interface IUserBaseEntity {
    readonly id: number;
    username: string;
    email: string;
    nickname: string;
    isAdmin: boolean;
}

export interface IUserEntity extends IUserBaseEntity {
    bio: string;
}
