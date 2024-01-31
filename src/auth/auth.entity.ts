import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import { UserEntity } from "@/user/user.entity";

@Entity("auth")
export class AuthEntity {
    @OneToOne(() => UserEntity, (user) => user.authPromise)
    @JoinColumn({ name: "userId" })
    public userPromise: Promise<UserEntity>;

    @PrimaryColumn({ nullable: false })
    public userId: number;

    @Column({ type: "char", length: 60, nullable: false })
    public password: string;
}
