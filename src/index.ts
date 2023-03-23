import express, { Request, Response } from "express";
import "reflect-metadata";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import AppDataSource from "./data-source";
import sessionConfig from "./session";
import session from "express-session";
import logger from "./utils/logger";
import morgan from "morgan";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import queryComplexity, {
    simpleEstimator,
    fieldExtensionsEstimator,
} from "graphql-query-complexity";
import {
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";

const app = express();

const main = async () => {
    AppDataSource.initialize();

    const schema = await buildSchema({
        resolvers: [__dirname + "/resolvers/**/*.ts"],
        /* authChecker: ({ context: { req } }) => {
            if(req.session.userId) return true;
            return false; // or false if access is denied
            return !!req.session.userId;
        } */
    });

    const apolloServer = new ApolloServer({
        schema,
        /* validationRules: [
            queryComplexity({
                maximumComplexity: 3,
                variables: {},
                onComplete: (complexity: number) => {
                    console.log("query ocmplexyty: ",complexity);
                },
                estimators: [
                    fieldExtensionsEstimator(),
                    simpleEstimator({
                        defaultComplexity: 1
                    })
                ]
            })
        ], */
        plugins: [
            process.env.NODE_ENV === "production"
                ? ApolloServerPluginLandingPageProductionDefault
                : ApolloServerPluginLandingPageGraphQLPlayground,
        ],
        context: ({ req, res }) => ({ req, res }),
    });

    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(session(sessionConfig));
    app.use(express.json());
    app.use(morgan("dev"));

    await apolloServer.start();

    apolloServer.applyMiddleware({ app });

    app.listen(process.env.SERVER_PORT, () => {
        logger.info("listening for requests on port " + process.env.SERVER_PORT);
    });
};

export default app;

main();
