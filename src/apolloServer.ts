import "reflect-metadata";

import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { buildSchemaSync } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { addMocksToSchema } from "@graphql-tools/mock";
import { createManufacturersLoader } from "./utils/manufacturersLoader";
import { createProductsLoader } from "./utils/productsLoader";

const schema = buildSchemaSync({
    resolvers: [`${__dirname}/resolvers/**/*.ts`],
});

const getApolloServer = (resolver?: object) =>
    new ApolloServer({
        schema:
            process.env.NODE_ENV === "test"
                ? addMocksToSchema({
                      schema: makeExecutableSchema({ typeDefs: schema }),
                      preserveResolvers: true,
                      resolvers: resolver,
                  })
                : schema,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
        context: ({ req, res }) => ({
            req,
            res,
            manufacturersLoader: createManufacturersLoader(),
            productsLoader: createProductsLoader(),
        }),
    });

export default getApolloServer;
