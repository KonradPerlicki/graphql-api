import { Field, ObjectType } from "type-graphql";
import User from "./User";

@ObjectType()
export default class UserWithValidationLink extends User {
    @Field({ nullable: true })
    validationLink?: string;
}
