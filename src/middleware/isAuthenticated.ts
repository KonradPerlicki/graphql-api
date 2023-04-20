import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/Context";

export const isAuthenticated: MiddlewareFn<Context> = async (
    { context: { req } },
    next
) => {
    if (!req.session.userId) {
        throw new Error("User is not authenticated");
    }

    return next();
};
