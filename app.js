import express from "express";
import InvoiceController from "./controllers/invoiceController.js";

const app = express();
const port = 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

//Page Principale
app.get("/", (req, res)=>{
    res.render("home.ejs");
});
//Routes invoices
app.get("/invoices", InvoiceController.showListInvoices);
app.get("/invoices/add", InvoiceController.showAddInvoiceForm);
app.post("/invoices/add", InvoiceController.addInvoice);
//Routes customers
app.get("/customers");
//Routes items
app.get("/items");

// const date = new Date();
// const formattedDate = date.toISOString().split('T')[0].replace(/-/g, ' ');
// console.log(new Date().toISOString().split('T')[0]);
// let test = "bonjour";
// console.log(test);
// test = [test];
// console.log(test);
// test = [test];
// // console.log(test);
// let summary = {};
// let test = "test";
// let id = "id";
// summary[id] = 0;
// // summary.id = 0;
// summary[test] = "bonjour";
// console.log(summary)


app.listen(port, ()=>{
    console.log(`Le serveur a démarrer sur http://127.0.0.1:${port}`);
});