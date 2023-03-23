import session from "express-session";
import pgSimple from "connect-pg-simple";
import pg from "pg";

const pgSession = pgSimple(session);
const pool = new pg.Pool({
    host: process.env.AWS_POSTGRES_HOST,
    port: 5432,
    user: process.env.AWS_POSTGRES_USER,
    password: process.env.AWS_POSTGRES_PASSWORD,
    database: process.env.AWS_POSTGRES_DBNAME,
});

export default {
    store: new pgSession({
        pool,
        tableName: "session_table",
        createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    name: "session",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days,
    },
} as session.SessionOptions;
