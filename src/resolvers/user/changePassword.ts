import { cache } from "./../../cache";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import { Context } from "../../types/Context";
import { ChangePasswordInput } from "../../types/user/ChangePasswordInput";
import User from "../../entity/User";
import { forgotPasswordPrefix } from "../../constants";

@Resolver()
export default class ChangePasswordResolver {
    @Mutation(() => User, { nullable: true })
    async changePassword(
        @Arg("data") { token, password }: ChangePasswordInput,
        @Ctx() ctx: Context
    ): Promise<User | null> {
        const user = await changePassword(token, password);

        if (user) {
            ctx.req.session.userId = user.id;
        }

        return user;
    }
}

async function changePassword(token: string, password: string) {
    const userId = cache.get<string>(forgotPasswordPrefix + token);
    if (!userId) return null;

    const user = await User.findOneBy({ id: userId });
    if (!user) return null;

    user.password = await bcrypt.hash(password, 12);
    await user.save();
    cache.del(forgotPasswordPrefix + token);

    return user;
}
