import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import User from "../../entity/User";
import RegisterInput from "../../types/user/RegisterInput";
import { isGuest } from "../../middleware/isGuest";

@Resolver()
export default class RegisterResolver {
    @UseMiddleware(isGuest)
    @Mutation(() => User)
    async register(
        @Arg("data") { firstName, lastName, email, password }: RegisterInput
    ): Promise<User> {
        const user = await User.create<User>({
            firstName,
            lastName,
            email,
            password,
        }).save();

        user.validationLink = await user.sendValidationEmail();

        return user;
    }
}
