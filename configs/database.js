import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "gesfactDB",
    password: "angusmg",
    port: 5432
});
db.connect();

export default db;