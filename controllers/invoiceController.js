import Invoice from "../models/Invoice.js";
import Customer from "../models/customer.js";
import Item from "../models/item.js";

class InvoiceController{
    //Enregistré la facture
    static async saveInvoice(req, res){
        console.log(req.body.selectItem);
    }
    //Vers la nouvelle factures
    static async showAddInvoiceForm(req, res){
        try {
            const customers = await Customer.fetchAllCustomers();
            const items = await Item.fetchAllItemsWithVat();

            res.render("invoicesForm.ejs", {
                customers,
                items,
                mode: "add",
                invoice: null // renvoie null pour eviter les erreur de reference dans le front
            })
        } catch (error) {
            console.log(error);
        }
    }
    //Methode pour afficher et trier la liste de factures
    static async showListInvoices(req, res){
        try {
            const search = req.query.search;
            const sort= req.query.sort;
            // console.log(search);
            // console.log(sort);
            let invoices = [];
            switch (sort) {
                case "date":
                    invoices = await Invoice.fetchInvoiceByInvoiceDate(search);                    
                    break;
                case "number":
                    invoices = await Invoice.fetchInvoiceByInvoiceNumber(search);
                    break;
            
                default:
                    invoices = await Invoice.fetchAllInvoicesWithLinkCustomer();
                    break;
            }
            // console.log(invoices);
            res.render("invoices.ejs", {
                invoices,
                search,
                sort
            });
        } catch (error) {
            console.log(error);
        }
    }
}
export default InvoiceController;