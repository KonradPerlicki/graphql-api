import { Field, ID, ObjectType } from "type-graphql";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    VersionColumn,
    BeforeInsert,
} from "typeorm";

import bcrypt from "bcryptjs";
import { Subject, sendEmail } from "../utils/sendEmail";

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

@ObjectType()
@Entity()
export default class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    lastName?: string;

    @Field()
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @Field()
    @Column({
        type: "boolean",
        default: false,
    })
    validatedEmail: boolean;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: string;

    @Field()
    @DeleteDateColumn()
    deletedAt: Date;

    @Field()
    @VersionColumn()
    version: number;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12);
    }

    async validatePassword(comparedPassword: string) {
        return await bcrypt.compare(comparedPassword, this.password);
    }

    async sendValidationEmail() {
        return await sendEmail(this.email, this.id, Subject.REGISTER);
    }
}
