import { cache } from "./../../cache";
import User from "../../entity/User";
import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { confirmationPrefix } from "../../constants";
import { isGuest } from "../../middleware/isGuest";

@Resolver()
export default class ConfirmEmailResolver {
    @UseMiddleware(isGuest)
    @Mutation(() => Boolean)
    async confirmEmail(@Arg("token") token: string): Promise<boolean> {
        return await confirm(token);
    }
}

export function confirm(token: string): Promise<boolean>;
export function confirm(token: string, testEnv: boolean): Promise<boolean>;
export async function confirm(token: string, testEnv?: boolean) {
    const userId = cache.get<string>(confirmationPrefix + token);
    if (!userId) return false;

    cache.del(confirmationPrefix + token);

    if (testEnv) {
        return true;
    }

    await User.update({ id: userId }, { validatedEmail: true });

    return true;
}
