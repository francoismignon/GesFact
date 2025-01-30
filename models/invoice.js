import db from "../configs/database.js"

class Invoice{
    static async fetchLastInvNumber(){
        const result = await db.query ("SELECT inv_number FROM invoice ORDER BY inv_number DESC LIMIT 1");
        return result.rows;
    }
    static async fetchAllInvoice(){
        const result = await db.query("SELECT * FROM invoice");
        return result.rows;
    }
    static async fetchInvoiceByInvNum(invNum){
        const result = await db.query("SELECT * FROM invoice WHERE inv_number = $1", [invNum]);
        return result.rows;
    }
    static async fetchInvoiceByDate(date){
        const result = await db.query("SELECT * FROM invoice WHERE inv_date = $1", [date]);
        return result.rows;
    }
    static async fetchInvoiceByCustLastName(custLastName){
        const result = await db.query("SELECT * FROM invoice INNER JOIN customers ON invoice.cust_id = customers.id WHERE cust_lastname = $1", [custLastName]);
        return result.rows;
    }
    static async fetchInvoiceByCustNumber(custNumber){
        const result = await db.query("SELECT * FROM invoice INNER JOIN customers ON invoice.cust_id = customers.id WHERE cust_number = $1", [custNumber]);
        return result.rows;
    }
}

export default Invoice;