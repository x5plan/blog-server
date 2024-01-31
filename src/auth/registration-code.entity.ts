import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { UserEntity } from "@/user/user.entity";

@Entity("registration_code")
export class RegistrationCodeEntity {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Index({ unique: true })
    @Column({ type: "uuid", nullable: false })
    public code: string;

    @Column({ type: "datetime", nullable: false })
    public expireDate: Date;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "creatorId" })
    public creatorPromise: Promise<UserEntity>;

    @Index({ unique: false })
    @Column({ nullable: false })
    public creatorId: number;

    @OneToOne(() => UserEntity)
    @JoinColumn({ name: "assaignedUserId" })
    public assaignedUserPromise: Promise<UserEntity>;

    @Index({ unique: true })
    @Column({ nullable: true })
    public assaignedUserId: number | null;
}
