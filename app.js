import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "gesfactDB",
    password: "angusmg",
    port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async(req, res) => {
    const result = await db.query("SELECT * FROM invoice");
    const factures = result.rows;
    console.log(factures)
    res.render("index.ejs", {
        factures: factures
    });
});

app.listen(port, () => {
    console.log(`Le serveur a démarré sur http://localhost:${port}`);
});