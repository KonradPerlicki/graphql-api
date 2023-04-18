import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import User from "../../entity/User";
import RegisterInput from "../../types/user/RegisterInput";
import UserWithValidationLink from "../../entity/UserWithValidationLink";
import { isGuest } from "../../middleware/isGuest";

@Resolver()
export default class RegisterResolver {
    @UseMiddleware(isGuest)
    @Mutation(() => UserWithValidationLink)
    async register(
        @Arg("data") { firstName, lastName, email, password }: RegisterInput
    ): Promise<UserWithValidationLink> {
        const user = await User.create<UserWithValidationLink>({
            firstName,
            lastName,
            email,
            password,
        }).save();

        user.validationLink = await user.sendValidationEmail();

        return user;
    }
}
