import { Field, InputType } from "type-graphql";
import { IsEmail, MinLength } from "class-validator";

@InputType()
export default class LoginInput {
    @Field(() => String)
    @IsEmail()
    email: string;

    @Field(() => String)
    @MinLength(6)
    password: string;
}
