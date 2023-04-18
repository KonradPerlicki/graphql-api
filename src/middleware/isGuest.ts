import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/Context";

export const isGuest: MiddlewareFn<Context> = async ({ context: { req } }, next) => {
    if (req.session.userId) {
        throw new Error("User is already authenticated");
    }

    await next();
};
