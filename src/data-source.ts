import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.AWS_POSTGRES_HOST,
    port: 5432,
    username: process.env.AWS_POSTGRES_USER,
    password: process.env.AWS_POSTGRES_PASSWORD,
    synchronize: process.env.NODE_ENV === "production" ? false : true,
    logging: process.env.NODE_ENV === "production" ? false : true,
    database: process.env.AWS_POSTGRES_DBNAME,
    entities: ["src/entity/*.*"],
    migrations: ["src/migrations/*.*"],
    subscribers: [],
    migrationsTableName: "migrations",
});

export default AppDataSource;
