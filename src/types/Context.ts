import { Request, Response } from "express";
import { UserSession } from "./UserSession";
import { createManufacturersLoader } from "../utils/manufacturersLoader";
import { createProductsLoader } from "../utils/productsLoader";

export interface Context {
    req: Request & {
        session: UserSession;
    };
    res: Response;
    manufacturersLoader: ReturnType<typeof createManufacturersLoader>;
    productsLoader: ReturnType<typeof createProductsLoader>;
}
