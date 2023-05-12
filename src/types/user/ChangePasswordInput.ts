import { Field, InputType } from "type-graphql";
import PasswordInput from "./Shared/PasswordInput";

@InputType()
export class ChangePasswordInput extends PasswordInput {
    @Field()
    token: string;
}
