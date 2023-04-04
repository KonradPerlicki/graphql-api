import { DataSource } from "typeorm";
import User from "./entity/User";

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.AWS_POSTGRES_HOST,
    port: 5432,
    username: process.env.AWS_POSTGRES_USER,
    password: process.env.AWS_POSTGRES_PASSWORD,
    synchronize: process.env.NODE_ENV === "production" ? false : true,
    logging: process.env.NODE_ENV === "production" ? false : true,
    database: process.env.AWS_POSTGRES_DBNAME,
    entities: [User],
    migrations: ["src/migrations/*.*"],
    subscribers: [],
    migrationsTableName: "migrations",
});

export default AppDataSource;
