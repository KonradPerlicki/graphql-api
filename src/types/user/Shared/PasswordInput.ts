import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export default abstract class PasswordInput {
    constructor(password?: string) {
        if (password) {
            this.password = password;
        }
    }

    @Field()
    @Length(6, 120, {
        message: "Password must be minimum length of 6 and maximum of 120 characters",
    })
    password: string;
}
