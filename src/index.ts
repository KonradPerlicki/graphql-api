import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import AppDataSource from "./data-source";
import sessionConfig from "./session";
import session from "express-session";
import createLogger from "./utils/logger";
import morgan from "morgan";
import getApolloServer from "./apolloServer";

const logger = createLogger(process.env.NODE_ENV as string);

const app = express();

const main = async () => {
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(session(sessionConfig));
    app.use(express.json());
    app.use(morgan("dev"));

    const apolloServer = getApolloServer();
    await apolloServer.start();

    apolloServer.applyMiddleware({ app });

    AppDataSource.initialize().then(() => {
        logger.info("DB connection established");

        app.listen(process.env.SERVER_PORT, () => {
            logger.info("listening for requests on port " + process.env.SERVER_PORT);
        });
    });
};

export default app;

main();
