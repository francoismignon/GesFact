import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "gesfactDB",
    password: "angusmg",
    port: 5432,
});
db.connect();

const app = express();
const port = 3000;

let factures = [];
let lastInvNum;
let clients = [];
let items = [];
let details =[];
let base21 = 0;
let base6 = 0;
let totHtva = 0;
let tva21 = 0;
let tva6 = 0;
let newInvNum;
let fullDate;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

function computeUnitHtva(montant, quantite){
    return montant * quantite;
}

function computeUnitTva(prixHtva, tva) {
    const result = prixHtva * (1 + (parseInt(tva) / 100));
    return result;
}

function computeTva(prixHtva, tva){
    const result = prixHtva * (parseInt(tva)/100);
    return result;
}

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
    const date = new Date();
    const day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();
    const month = ((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    const year = date.getFullYear()
    fullDate = day + "/" + month + "/" + year;
    newInvNum = lastInvNum.toString();
    res.render("facture.ejs", {
        newInvNum,
        fullDate
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
    res.render("facture.ejs", {
        clients, 
        items,
        details,
        newInvNum,
        fullDate
    });
});

app.post("/searcharticle", async(req, res)=>{
    const result = await db.query(`SELECT * FROM item WHERE ${req.body.searchItem} = $1`, [req.body.searchItemField]);
    items = [];
    result.rows.forEach(item => {
        items.push({
            id: item.id,
            label: item.item_label,
            description: item.item_description
        })
    });
    res.render("facture.ejs", {
        items,
        clients,
        details,
        newInvNum,
        fullDate
    });
});

app.post("/addtodetails", async(req, res)=>{
    const id = req.body.id;
    const result = await db.query("SELECT i.id, i.item_label, i.item_description, i.item_retail_price, v.vat_percentage  FROM item AS i INNER JOIN vattype AS vt ON i.vat_type_id = vt.id INNER JOIN vat AS v ON v.vat_type_id = vt.id WHERE i.id = $1", [id]);
    result.rows.forEach(itemVat => {
        details.push(itemVat);
    });
    res.render("facture.ejs", {
        clients,
        details,
        newInvNum,
        fullDate
    });

});

app.post("/validligne", async(req, res)=>{
    let factureDetails = [];
    details.forEach((detail, index) => {
        let d = {};
        d.id = detail.id;
        d.line_number = index + 1;
        d.item_label = detail.item_label;
        d.item_description = detail.item_description;
        d.item_retail_price = detail.item_retail_price;
        d.vat_percentage = detail.vat_percentage;
        d.qty = req.body["inputQty" + detail.id];
        d.discount = req.body["inputOpt" + detail.id];
        factureDetails.push(d);
    });
    factureDetails.forEach(d => {
        d.totHtva = computeUnitHtva(d.item_retail_price, d.qty);
    });
    console.log(factureDetails);
    factureDetails.forEach(d => {
        totHtva += d.totHtva;
    });
    factureDetails.forEach(d => {
        if (d.vat_percentage === "21.00") {
            let totTva = computeUnitTva(d.totHtva, d.vat_percentage);
            let tva = computeTva(d.totHtva, d.vat_percentage);
            base21 += totTva;
            tva21 += tva;
        } else {
            let totTva = computeUnitTva(d.totHtva, d.vat_percentage);
            let tva = computeTva(d.totHtva, d.vat_percentage);
            base6 += totTva;
            tva6 += tva;
        }
    });
    res.render("facture.ejs", {
        clients,
        factureDetails,
        base21: base21.toFixed(2),
        base6 : base6.toFixed(2),
        totHtva,
        totTvac : (base21 + base6).toFixed(2),
        tva: (tva21 + tva6).toFixed(2),
        newInvNum,
        fullDate
    });
});

app.post("/validfacture", async(req, res)=>{
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Le serveur a démarré sur http://127.0.0.1:${port}`);
});

