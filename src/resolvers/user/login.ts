import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import User from "../../entity/User";
import LoginInput from "../../types/user/LoginInput";
import { Context } from "../../types/Context";
import { UserSession } from "../../types/UserSession";

@Resolver()
export default class LoginResolver {
    @Mutation(() => User, { nullable: true })
    async login(
        @Arg("datas") { email, password }: LoginInput,
        @Ctx() ctx: Context
    ): Promise<User | null> {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return null;
        }

        const valid = await user.validatePassword(password);
        if (!valid) {
            return null;
        }

        if (!user.validatedEmail) {
            return null;
        }

        (ctx.req.session as UserSession).userId = user.id;

        return user;
    }
}
