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

export function changePassword(token: string, password: string): Promise<User | null>;
export function changePassword(
    token: string,
    password: string,
    testEnv: boolean
): Promise<User | null>;
export async function changePassword(token: string, password: string, testEnv?: boolean) {
    const userId = cache.get<string>(forgotPasswordPrefix + token);
    if (!userId) return null;

    if (testEnv) {
    }

    const user = await User.findOneBy({ id: userId });
    if (!user) return null;

    user.password = await bcrypt.hash(password, 12);
    await user.save();
    cache.del(forgotPasswordPrefix + token);

    return user;
}
