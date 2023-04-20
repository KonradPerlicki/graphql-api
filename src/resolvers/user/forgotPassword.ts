import { Arg, Mutation, Resolver } from "type-graphql";
import User from "../../entity/User";
import { Subject, sendEmail } from "../../utils/sendEmail";
import { isEmail } from "class-validator";

@Resolver()
export default class ForgotPasswordResolver {
    @Mutation(() => String, { nullable: true })
    async forgotPassword(@Arg("email") email: string): Promise<string | null> {
        return await sendForgotPasswordMail(email);
    }
}

export function sendForgotPasswordMail(email: string): Promise<string | null>;
export function sendForgotPasswordMail(
    email: string,
    testEnv: boolean
): Promise<string | null>;
export async function sendForgotPasswordMail(
    email: string,
    testEnv?: boolean
): Promise<string | null> {
    if (testEnv) {
        if (isEmail(email)) return "email address exists in db";
        return null;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    return await sendEmail(email, user.id, Subject.FORGOTPASSWORD);
}
