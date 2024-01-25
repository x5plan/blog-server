import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import { UserEntity } from "@/user/user.entity";

@Entity("auth")
export class AuthEntity {
    @OneToOne(() => UserEntity, (user) => user.authPromise)
    @JoinColumn({ name: "userId" })
    public userPromise: Promise<UserEntity>;

    @PrimaryColumn()
    public userId: number;

    @Column({ type: "char", length: 60 })
    public password: string;
}
