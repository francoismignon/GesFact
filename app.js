import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import Facture from "./models/Facture.js"
import Article from "./models/Article.js";


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
let clients = [];
let items = [];
let chosenItems = [];

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
    const result = await db.query(`SELECT * FROM customers WHERE ${req.body.searchclient} = $1`, [req.body.searchclientField]);
    clients=[];
    result.rows.forEach(client => {
        clients.push({
            id: client.id,
            nom : client.cust_lastname,
            prenom : client.cust_firstname
        });
    });
    res.render("facture.ejs", {clients, items});
});

app.post("/searcharticle", async(req, res)=>{
    const result = await db.query(`SELECT * FROM item WHERE ${req.body.searchItem} = $1`, [req.body.searchItemField]);
    items = [];
    result.rows.forEach(item => {
        let article = new Article();
        article.id = item.id;
        article.vatTypeId = item.vat_type_id;
        article.unitId = item.unit_id;
        article.classId = item.class_id;
        article.itemNumber = item.item_number;
        article.itemEan = item.item_ean;
        article.itemLabel = item.item_label;
        article.itemDesc = item.item_description;
        article.itemRetailPrice = item.item_retail_price;
        items.push(article);
    });
    res.render("facture.ejs", {
        items,
        clients
    });
});

app.post("/addtodetails", async(req, res)=>{
    const id = parseInt(req.body.id);
    const index = items.findIndex((item) => item.id === id);
    chosenItems.push(items[index]);
    console.log(chosenItems);
    res.render("facture.ejs", {
        clients,
        chosenItems
    });
});

app.post("/save", (req, res)=>{
    
    // res.redirect("/");
});

app.listen(port, () => {
    console.log(`Le serveur a démarré sur http://127.0.0.1:${port}`);
});