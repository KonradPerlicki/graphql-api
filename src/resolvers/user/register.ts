import { Arg, Mutation, Resolver } from "type-graphql";
import User from "../../entity/User";
import RegisterInput from "../../types/user/RegisterInput";

@Resolver()
export default class RegisterResolver {
    @Mutation(() => User)
    async register(
        @Arg("data") { firstName, lastName, email, password }: RegisterInput
    ): Promise<User> {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
        }).save();

        return user;
    }
}
