import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import User from "../../entity/User";
import { Subject, sendEmail } from "../../utils/sendEmail";
import { isGuest } from "../../middleware/isGuest";

@Resolver()
export default class ForgotPasswordResolver {
    @UseMiddleware(isGuest)
    @Mutation(() => String, { nullable: true })
    async forgotPassword(@Arg("email") email: string): Promise<string | null> {
        const user = await User.findOne({ where: { email } });
        if (!user) return null;

        return await sendEmail(email, user.id, Subject.FORGOTPASSWORD);
    }
}
