import express from "express";
import InvoiceController from "./controllers/invoiceController.js";
import CustomerController from "./controllers/customerController.js";
import ItemController from "./controllers/itemController.js";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Page Principale
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// Routes Factures
app.get("/invoices", InvoiceController.showListInvoices);
app.get("/invoices/add", InvoiceController.showAddInvoiceForm);
app.post("/invoices/add", InvoiceController.addInvoice);
app.get("/invoices/edit/:id", InvoiceController.showEditInvoiceForm);
app.post("/invoices/edit/:id", InvoiceController.updateInvoice);

// Routes Clients
app.get("/customers", CustomerController.showListCustomers);
app.get("/customers/add", CustomerController.showAddCustomerForm);
app.post("/customers/add", CustomerController.addCustomer);
app.get("/customers/edit/:id", CustomerController.showEditCustomerForm);
app.post("/customers/edit/:id", CustomerController.updateCustomer);

// Routes Articles
app.get("/items", ItemController.showListItems);
app.get("/items/add", ItemController.showAddItemForm);
app.post("/items/add", ItemController.addItem);
app.get("/items/edit/:id", ItemController.showEditItemForm);
app.post("/items/edit/:id", ItemController.updateItem);

app.listen(port, () => {
  console.log(`Le serveur a démarré sur http://127.0.0.1:${port}`);
});
