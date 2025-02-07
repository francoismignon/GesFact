import Customer from "../models/customer.js";

class CustomerController {
  // Affichage de la liste des clients
  static async showListCustomers(req, res) {
    try {
      const customers = await Customer.fetchAllCustomers();
      res.render("customers.ejs", { customers });
    } catch (error) {
      console.log(error);
    }
  }

  // Affichage du formulaire d'ajout d'un client
  static async showAddCustomerForm(req, res) {
    const lastCustomerNumber = await Customer.fetchLastCustomerNumber();
    // console.log(typeof(lastCustomerNumber.cust_number));
    console.log(lastCustomerNumber.length);
    res.render("customerForm.ejs", { 
      mode: "add", 
      customer: null ,
      custNumber : lastCustomerNumber.length === 0 ?1000:lastCustomerNumber[0].cust_number + 1
    });
  }

  // Ajout d'un client
  static async addCustomer(req, res) {
    try {
      await Customer.create(req.body);
      console.log(req.body);
      res.redirect("/customers");
    } catch (error) {
      console.log(error);
    }
  }

  // Affichage du formulaire d'édition d'un client
  static async showEditCustomerForm(req, res) {
    try {
      const id = req.params.id;
      const customer = await Customer.fetchCustomerById(id);
      res.render("customerForm.ejs", { mode: "edit", customer });
    } catch (error) {
      console.log(error);
    }
  }

  // Mise à jour d'un client
  static async updateCustomer(req, res) {
    try {
      const id = req.params.id;
      await Customer.update(id, req.body);
      res.redirect("/customers");
    } catch (error) {
      console.log(error);
    }
  }
}

export default CustomerController;
