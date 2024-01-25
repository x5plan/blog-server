import { Column, Entity, Index, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { AuthEntity } from "@/auth/auth.entity";

import type { IUserEntity } from "./user.types";

@Entity("user")
export class UserEntity implements IUserEntity {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({ type: "varchar", length: 24 })
    @Index({ unique: true })
    public username: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    @Index({ unique: true })
    public email: string;

    @Column({ type: "varchar", length: 24, nullable: true })
    public nickname: string;

    @Column({ type: "text", nullable: true })
    public bio: string;

    @Column({ type: "boolean", default: false })
    public isAdmin: boolean;

    @OneToOne(() => AuthEntity, (auth) => auth.userPromise)
    public authPromise: Promise<AuthEntity>;
}
