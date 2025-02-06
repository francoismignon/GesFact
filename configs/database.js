import pg from "pg";

// Création d'un client PostgreSQL avec les informations de connexion
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "gesfactDB",
    password: "angusmg",
    port: 5432
});
db.connect(); // Connexion à la base de données

export default db;
