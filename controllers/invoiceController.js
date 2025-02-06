import Invoice from "../models/Invoice.js";
import Item from "../models/item.js";

class InvoiceController{
    //Enregistré la facture
    static async addInvoice(req, res){
        try {
        //Recuperetion des donnée
        const data={
            cust_id: req.body.cust_id,
            inv_date: req.body.date_emission,
            inv_duedate: req.body.date_echeance
        };
        //Calcule date ech si absente
        if (!data.inv_duedate) {
            const dateEmission = new Date(data.inv_date);
            // console.log(typeof(dateEmission));
            // console.log(dateEmission);
            dateEmission.setDate(dateEmission.getDate() + 30);
            // console.log(dateEmission);
            data.inv_duedate = dateEmission;
            // console.log(req.body.date_emission);
            // console.log(dateEmission);
        }
        //creation de l'objet facture
        const invoice = new Invoice(data);
        await invoice.create();
        const invoiceId = invoice.id; // on recupere l'id de la facture que l'on viens de creer

        //On recupere les articles
        let itemIds = req.body.selectItem;
        let quantities = req.body.qty;
        let discounts = req.body.discount;
        console.log(itemIds);

        // On convertis les article en tableau si jamais il n'y un qu'une seul ligne de facture
        if (!Array.isArray(itemIds)) {
            quantities = [quantities],
            discounts = [discounts]
        }
        // console.log(quantities);
        // console.log(discounts);
        //on ajoute les details a la facture
        // utilisation de for car await ne fonctione pas avec foreach
        for(let i = 0; i < itemIds.length; i++){
            const itemId = itemIds[i];
            const qty = parseFloat(quantities[i]);
            const discount = parseFloat(discounts[i]);
            const item = await Item.fetchItemById(itemId);
            // console.log(item);
            const price = item.item_retail_price;
            const vat_percentage = parseFloat(item.vat_percentage);
            const totalLine = price * qty * (1 - discount/100);
            // console.log(typeof(price));
            // console.log(price);
            // console.log(item.item_retail_price);
            // await Invoice.createInvoiceDetail(invoiceId, i + 1, itemId, qty, discount, totalLine, vat_percentage);

        }
        // res.redirect('/invoices');
        } catch (error) {
            console.log(error);
        }
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