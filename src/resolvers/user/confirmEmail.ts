import { cache } from "./../../cache";
import User from "../../entity/User";
import { Arg, Mutation, Resolver } from "type-graphql";
import { confirmationPrefix } from "../../constants";

@Resolver()
export default class ConfirmEmailResolver {
    @Mutation(() => Boolean)
    async confirmEmail(@Arg("token") token: string): Promise<boolean> {
        const userId = cache.get<string>(confirmationPrefix + token);
        if (!userId) return false;

        await User.update({ id: userId }, { validatedEmail: true });
        cache.del(confirmationPrefix + token);
        return true;
    }
}
