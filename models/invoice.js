import db from "../configs/database.js"

class Invoice{
    constructor(id, cust_id, inv_number, inv_date, inv_duedate, inv_vatamount, inv_imposable_base_mount){
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
    static async create(invoice){};
    static async update(id, invoice){};
    static async delete(id){};
}
export default Invoice;