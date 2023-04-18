import { Request, Response } from "express";
import { UserSession } from "./UserSession";

export interface Context {
    req: Request & {
        session: UserSession;
    };
    res: Response;
}
