import db from "../configs/database.js"

class Customer{
    static async fetchAllCustomer(){}
    static async fetchCustomerByCustNumber(custNumber){
        try {
            const result = await db.query("SELECT * FROM customers WHERE cust_number = $1", [custNumber]);
            return result.rows;
        } catch (error) {
            console.log(error);
        }
    }
    static async fetchCustomerByCustLastName(custLastName){
        try {
            const result = await db.query("SELECT * FROM customers WHERE cust_lastname = $1", [custLastName]);
            return result.rows;
        } catch (error) {
            console.log(error);
        }
    }
    static async fetchCustomerByCustVatNumber(custVatNumber){
        try {
            const result = await db.query("SELECT * FROM customers WHERE cust_vat_number = $1", [custVatNumber]);
            return result.rows;
        } catch (error) {
            console.log(error);
        }
    }
}
export default Customer;