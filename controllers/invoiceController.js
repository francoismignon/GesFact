import Invoice from "../models/invoice.js"

class InvoiceController{
    //Affiche la page de creation de facture
    static async showNewInvoiceForm(req, res){
        try {
            const lastInvNum = await Invoice.fetchLastInvNumber();
            const invNum = parseInt(lastInvNum[0].inv_number) + 1;
            const date = new Date();
            const day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();
            const month = ((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            const year = date.getFullYear()
            const fullDate = day + "/" + month + "/" + year;
            
            res.render("facture.ejs", {
                invNum,
                fullDate
            })
        } catch (error) {
            console.log(error);
        }
    }
    //fonction qui liste toute les factures
    static async getAllInvoice(req, res){
        const invoices = await Invoice.fetchAllInvoice();
        res.render("index.ejs", {invoices});
    }
    //fonction qui filtre par numero de factures
    static async getInvoiceBy(req, res){
        try {
            let invoicesBy;
            const invoices = await Invoice.fetchAllInvoice();
            if (req.body.searchSelect === "inv_number") {
                invoicesBy = await Invoice.fetchInvoiceByInvNum(req.body.searchField);
            } 
            else if(req.body.searchSelect === "inv_date"){
                invoicesBy = await Invoice.fetchInvoiceByDate(req.body.searchDate);
            }
            else if(req.body.searchSelect === "cust_lastname"){
                invoicesBy = await Invoice.fetchInvoiceByCustLastName(req.body.searchField);
            } else {
                invoicesBy = await Invoice.fetchInvoiceByCustNumber(req.body.searchField);
            }
            res.render("index.ejs", {
                invoices,
                invoicesBy
            });
        } catch (error) {
            console.log(error);
        }
    }
}
export default InvoiceController;