import { Length, IsEmail, IsOptional } from "class-validator";
import { Field, InputType } from "type-graphql";
import { EmailExist } from "../../middleware/emailExist";
import PasswordInput from "./Shared/PasswordInput";

@InputType()
export default class RegisterInput extends PasswordInput {
    constructor(data?: RegisterInput) {
        super(data?.password);

        if (data) {
            this.firstName = data.firstName;
            this.lastName = data.lastName;
            this.email = data.email;
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
}
