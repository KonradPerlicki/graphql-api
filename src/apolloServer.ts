import "reflect-metadata";

import {
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { buildSchemaSync } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import queryComplexity, {
    simpleEstimator,
    fieldExtensionsEstimator,
} from "graphql-query-complexity";

const schema = buildSchemaSync({
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

export default apolloServer;