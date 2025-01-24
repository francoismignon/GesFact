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
let factures = [];
let lastInvNum;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    const resultByDate = await db.query("SELECT * FROM invoice ORDER BY inv_date ASC");
    const resultByNum = await db.query("SELECT * FROM invoice ORDER BY inv_number ASC");
    const result = await db.query("SELECT inv_number FROM invoice ORDER BY inv_number DESC");
    //On retient quelle est le derniere numero de factures pour pouvoir l'incrementé de 1 lors de la creation de la prochaine facture
    lastInvNum = result.rows[0].inv_number;
    const facturesByDate = resultByDate.rows;
    const facturesByNum = resultByNum.rows;
    res.render("index.ejs", {
        facturesByDate,
        facturesByNum,
        factures
    });
});

app.post("/search", async (req, res) => {
    let param = "";
    if (req.body.searchDate) {
        param = req.body.searchDate
    } else {
        param = req.body.searchField
    }
    const result = await db.query(`SELECT * FROM invoice AS i FULL OUTER JOIN customers AS c ON i.cust_id = c.id WHERE ${req.body.searchSelect} = $1 ORDER BY inv_number ASC`, [param]);
    factures = [];
    result.rows.forEach(facture => {
        const date = facture.inv_date;
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear().toString();
        let dayStr;
        let monthStr;

        (day < 10) ? dayStr = "0" + day.toString() : dayStr = day.toString();
        (month < 10) ? monthStr = "0" + month.toString() : monthStr = month.toString();

        const fullDate = `${dayStr}-${monthStr}-${year}`;
        facture.inv_date = fullDate;
        factures.push(facture);
    });



    res.redirect("/");
});

app.get("/new", async (req, res) => {
    lastInvNum++;
    let newInvNum = lastInvNum.toString();
    res.render("facture.ejs", {
        newInvNum
    }
    );
});

app.post("/searchclient", async(req, res)=>{
    const param = req.body.searchclient;
    console.log(req.body.searchclient);
    const result = await db.query(`SELECT * FROM customers WHERE `);
});

app.listen(port, () => {
    console.log(`Le serveur a démarré sur http://127.0.0.1:${port}`);
});