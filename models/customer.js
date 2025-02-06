import db from "../configs/database.js"

class Customer{
    constructor({ id, cust_number, cust_firstname, cust_lastname, cust_compagny, cust_vat_number, cust_compagny_number, cust_export_number, cust_enable, cust_phone, cust_mobile, cust_fax, cust_mail, cust_info }) {
        this.id = id;
        this.cust_number = cust_number;
        this.cust_firstname = cust_firstname;
        this.cust_lastname = cust_lastname;
        this.cust_compagny = cust_compagny;
        this.cust_vat_number = cust_vat_number;
        this.cust_compagny_number = cust_compagny_number;
        this.cust_export_number = cust_export_number;
        this.cust_enable = cust_enable;
        this.cust_phone = cust_phone;
        this.cust_mobile = cust_mobile;
        this.cust_fax = cust_fax;
        this.cust_mail = cust_mail;
        this.cust_info = cust_info;
      }

    static async fetchAllCustomers(){
        const customers = await db.query ("SELECT * FROM customers");
        return customers.rows;
    }
}
export default Customer;