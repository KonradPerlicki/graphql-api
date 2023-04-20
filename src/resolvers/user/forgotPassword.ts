import { Arg, Mutation, Resolver } from "type-graphql";
import User from "../../entity/User";
import { Subject, sendEmail } from "../../utils/sendEmail";

@Resolver()
export default class ForgotPasswordResolver {
    @Mutation(() => String, { nullable: true })
    async forgotPassword(@Arg("email") email: string): Promise<string | null> {
        const user = await User.findOne({ where: { email } });
        if (!user) return null;

        return await sendEmail(email, user.id, Subject.FORGOTPASSWORD);
    }
}
