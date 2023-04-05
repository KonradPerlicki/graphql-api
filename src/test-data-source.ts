import { DataSource } from "typeorm";
import User from "./entity/User";
import dotenv from "dotenv";
dotenv.config();

const TestDataSource = new DataSource({
    type: "postgres",
    host: process.env.AWS_POSTGRES_HOST,
    port: 5432,
    username: process.env.AWS_POSTGRES_USER,
    password: process.env.AWS_POSTGRES_PASSWORD,
    synchronize: true,
    database: "test_db",
    entities: [User],
    migrations: ["src/migrations/*.*"],
    subscribers: [],
    migrationsTableName: "migrations",
    dropSchema: true,
    logging: false,
});

export default TestDataSource;
