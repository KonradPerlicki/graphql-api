import winston from "winston";
import dayjs from "dayjs";
import { capitalize } from "lodash";

const myFormat = winston.format.printf(({ level, message }) => {
    return `[${dayjs().add(1, "hour").format()}] - ${capitalize(level)}: ${message}`;
});

const logger = winston.createLogger({
    format: myFormat,
});

export default function (env: "development" | "production" | "test" | string) {
    logger.clear();
    logger.exceptions.handle(
        new winston.transports.File({ filename: "var/logs/exceptions.log" })
    );

    if (env === "production") {
        logger.add(
            new winston.transports.File({
                filename: "var/logs/all-logs.log",
            })
        );
    } else {
        logger.add(
            new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(), myFormat),
            })
        );
        logger.add(
            new winston.transports.File({
                filename: "var/logs/error.log",
                level: "error",
            })
        );
    }

    return logger;
}
