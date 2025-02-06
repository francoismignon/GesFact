import db from "../configs/database.js"

class Invoice{
    constructor({id, cust_id, inv_number, inv_date, inv_duedate, inv_vatamount, inv_imposable_base_mount}){
        this.id = id;
        this.cust_id = cust_id;
        this.inv_number = inv_number;
        this.inv_date = inv_date;
        this.inv_duedate = inv_duedate;
        this.inv_vatamount = inv_vatamount;
        this.inv_imposable_base_mount = inv_imposable_base_mount;
    }
    //CRUD
    static async fetchInvoiceByInvoiceNumber(invNumber){
        const invoices = await db.query("SELECT * FROM invoice AS i INNER JOIN customers AS c ON i.cust_id = c.id WHERE inv_number = $1", [invNumber]);
        return invoices.rows;
    }
    static async fetchInvoiceByInvoiceDate(invDate){
        const invoices = await db.query("SELECT * FROM invoice AS i INNER JOIN customers AS c ON i.cust_id = c.id WHERE inv_date = $1", [invDate]);
        return invoices.rows;
    }
    static async fetchAllInvoicesWithLinkCustomer(){
        const invoices = await db.query("SELECT * FROM invoice AS i INNER JOIN customers AS c ON i.cust_id = c.id");
        return invoices.rows;
    };
    static async fetchInvoicesById(id){};
    async create(){
        this.inv_number = `INV - ${10000 + Math.floor(Math.random() * 90000)}`//generation num facture unique
        const id = await db.query ("INSERT INTO invoice (cust_id, inv_number, inv_date, inv_duedate, inv_vatamount, inv_imposable_base_mount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [this.cust_id, this.inv_number, this.inv_date, this.inv_duedate, this.inv_vatamount, this.inv_imposable_base_mount]);
        this.id = id.rows[0].id;// l'id retourner par la requete est assigné a lid de cet objet facture
    };
    static async createInvoiceDetail(invoiceId, lineNumber, itemId, qty, discount, price, vat_percentage) {
        await db.query(
            "INSERT INTO invoicedetail (invoice_id, item_id, vattype_id, line_number, qty, price, discount, vat_percentage) VALUES ($1, $2, 1, $3, $4, $5, $6, $7)",
            [invoiceId, itemId, lineNumber, qty, price, discount, vat_percentage]
        );
    }
    
    static async update(id, invoice){};
    static async delete(id){};
}
export default Invoice;