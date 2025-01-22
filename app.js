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
    const resultByDate = await db.query("SELECT * FROM invoice ORDER BY inv_date ASC");
    const resultByNum = await db.query("SELECT * FROM invoice ORDER BY inv_number ASC");
    const facturesByDate = resultByDate.rows;
    const facturesByNum = resultByNum.rows;
    res.render("index.ejs", {
        facturesByDate,
        facturesByNum
    });
});

app.post("/search", async(req, res)=>{
    console.log(req.body.searchField);
    console.log(req.body.searchSelect);
});

app.listen(port, () => {
    console.log(`Le serveur a démarré sur http://localhost:${port}`);
});