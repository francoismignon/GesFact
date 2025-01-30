import Customer from "../models/customer.js";

class CustomerController{
    static async getCustomerBy(req, res){
        try {
            let customers;
            switch (req.body.searchclient) {
                case "cust_number":
                    customers = await Customer.fetchCustomerByCustNumber(req.body.searchclientField);
                    break;
                case "cust_lastname":
                    customers = await Customer.fetchCustomerByCustLastName(req.body.searchclientField);
                    break;
                case "cust_vat_number":
                    customers = await Customer.fetchCustomerByCustVatNumber(req.body.searchclientField);
                    break;
                default:
                    break;
            }
            res.render("facture.ejs", {
                customers
            });
        } catch (error) {
            console.log(error);
        }
    }
}
export default CustomerController;