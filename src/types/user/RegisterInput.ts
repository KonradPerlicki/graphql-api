import { Length, IsEmail, IsOptional } from "class-validator";
import { Field, InputType } from "type-graphql";
import { EmailExist } from "../../middleware/emailExist";

@InputType()
export default class RegisterInput {
    constructor(data?: RegisterInput) {
        if (data) {
            this.firstName = data.firstName;
            this.lastName = data.lastName;
            this.email = data.email;
            this.password = data.password;
        }
    }

    @Field({ nullable: true })
    @IsOptional()
    @Length(2, 255)
    firstName?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Length(2, 255)
    lastName?: string;

    @Field()
    @IsEmail()
    @EmailExist({ message: "Email already exists" })
    email: string;

    @Field()
    @Length(6, 120, {
        message: "Password must be minimum length of 6 and maximum of 120 characters",
    })
    password: string;
}
