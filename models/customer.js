import db from "../configs/database.js"

class Customer{
    static async fetchAllCustomers(){
        const customers = await db.query ("SELECT * FROM customers");
        return customers.rows;
    }
}
export default Customer;