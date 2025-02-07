import db from "../configs/database.js";

class Customer {
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

  //Recupere le derneier numero de client
  static async fetchLastCustomerNumber(){
    const result = await db.query("SELECT cust_number FROM customers ORDER BY cust_number DESC LIMIT 1");
    return result.rows;
  }

  // Récupérer tous les clients
  static async fetchAllCustomers() {
    const customers = await db.query("SELECT * FROM customers");
    return customers.rows;
  }

  // Récupérer un client par son ID
  static async fetchCustomerById(id) {
    const result = await db.query("SELECT * FROM customers WHERE id = $1", [id]);
    return result.rows[0];
  }

  // Création d'un client
  static async create(data) {
    const query = `
      INSERT INTO customers 
      (cust_number, cust_firstname, cust_lastname, cust_compagny, cust_vat_number, cust_compagny_number, cust_export_number, cust_enable, cust_phone, cust_mobile, cust_fax, cust_mail, cust_info)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    const values = [
      data.cust_number,
      data.cust_firstname,
      data.cust_lastname,
      data.cust_compagny,
      data.cust_vat_number,
      data.cust_compagny_number,
      data.cust_export_number,
      data.cust_enable || true,
      data.cust_phone,
      data.cust_mobile,
      data.cust_fax,
      data.cust_mail,
      data.cust_info
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Mise à jour d'un client
  static async update(id, data) {
    const query = `
      UPDATE customers 
      SET cust_number = $1, cust_firstname = $2, cust_lastname = $3, cust_compagny = $4, cust_vat_number = $5, cust_compagny_number = $6, cust_export_number = $7, cust_enable = $8, cust_phone = $9, cust_mobile = $10, cust_fax = $11, cust_mail = $12, cust_info = $13
      WHERE id = $14
      RETURNING *
    `;
    const values = [
      data.cust_number,
      data.cust_firstname,
      data.cust_lastname,
      data.cust_compagny,
      data.cust_vat_number,
      data.cust_compagny_number,
      data.cust_export_number,
      data.cust_enable || true,
      data.cust_phone,
      data.cust_mobile,
      data.cust_fax,
      data.cust_mail,
      data.cust_info,
      id
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }
}

export default Customer;
