import { Column, Entity, Index, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { AuthEntity } from "@/auth/auth.entity";

@Entity("user")
export class UserEntity {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({ type: "varchar", length: 24, nullable: false })
    @Index({ unique: true })
    public username: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    @Index({ unique: true })
    public email: string;

    @Column({ type: "boolean", default: false, nullable: false })
    public publicEmail: boolean;

    @Column({ type: "varchar", length: 24, nullable: true })
    public nickname: string | null;

    @Column({ type: "text", nullable: true })
    public bio: string | null;

    @Column({ type: "boolean", default: false, nullable: false })
    public isAdmin: boolean;

    @OneToOne(() => AuthEntity, (auth) => auth.userPromise)
    public authPromise: Promise<AuthEntity>;
}
