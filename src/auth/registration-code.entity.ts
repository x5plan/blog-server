import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { UserEntity } from "@/user/user.entity";

@Entity("registration_code")
export class RegisterCodeEntity {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Index({ unique: true })
    @Column({ type: "uuid" })
    public code: string;

    @Column({ type: "datetime" })
    public expireDate: Date;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "creatorId" })
    public creatorPromise: Promise<UserEntity>;

    @Index({ unique: false })
    @Column()
    public creatorId: number;

    @OneToOne(() => UserEntity)
    @JoinColumn({ name: "assigneedUserId" })
    public assaignedUserPromise: Promise<UserEntity>;

    @Index({ unique: true })
    @Column({ nullable: true })
    public assaignedUserId: number;
}
