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
app.post("/invoices/add", InvoiceController.saveInvoice);
//Routes customers
app.get("/customers");
//Routes items
app.get("/items");

app.listen(port, ()=>{
    console.log(`Le serveur a démarrer sur http://127.0.0.1:${port}`);
});