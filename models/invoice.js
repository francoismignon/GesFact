import db from "../configs/database.js";

class Invoice {
  constructor({ id, cust_id, inv_number, inv_date, inv_duedate, inv_vatamount, inv_imposable_base_mount, flag_accounting }) {
    this.id = id;
    this.cust_id = cust_id;
    this.inv_number = inv_number;
    this.inv_date = inv_date;
    this.inv_duedate = inv_duedate;
    this.inv_vatamount = inv_vatamount;
    this.inv_imposable_base_mount = inv_imposable_base_mount;
    this.flag_accounting = flag_accounting || 0; // Par défaut, 0 indique facture non comptabilisée
  }

  //Recuperation d'une facture avec tous les details par son ID
  static async fetchAllInvoicesWithInvoiceDetails(id){
    const invoiceWithDetails = ("SELECT * FROM invoice AS i INNER JOIN invoicedetail AS idet ON idet.invoice_id = i.id WHERE i.id = $1", [id]);
    return invoiceWithDetails.rows;
  }

  // Création d'une facture
  async create() {
    // Génération d'un numéro de facture unique
    this.inv_number = `INV - ${10000 + Math.floor(Math.random() * 90000)}`;
    const result = await db.query(
      "INSERT INTO invoice (cust_id, inv_number, inv_date, inv_duedate, inv_vatamount, inv_imposable_base_mount, flag_accounting) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [this.cust_id, this.inv_number, this.inv_date, this.inv_duedate, this.inv_vatamount || 0, this.inv_imposable_base_mount || 0, this.flag_accounting]
    );
    this.id = result.rows[0].id;
  }

  // Récupération des factures par numéro de facture
  static async fetchInvoiceByInvoiceNumber(invNumber) {
    const invoices = await db.query(
      "SELECT * FROM invoice AS i INNER JOIN customers AS c ON i.cust_id = c.id WHERE inv_number = $1", 
      [invNumber]
    );
    return invoices.rows;
  }

  // Récupération des factures par date d'émission
  static async fetchInvoiceByInvoiceDate(invDate) {
    const invoices = await db.query(
      "SELECT * FROM invoice AS i INNER JOIN customers AS c ON i.cust_id = c.id WHERE inv_date = $1", 
      [invDate]
    );
    return invoices.rows;
  }

  // Récupération de toutes les factures avec les informations du client associé
  static async fetchAllInvoicesWithLinkCustomer() {
    const invoices = await db.query(
      "SELECT * FROM invoice AS i INNER JOIN customers AS c ON i.cust_id = c.id"
    );
    return invoices.rows;
  }

  // Récupérer une facture par son ID
  static async fetchInvoiceById(id) {
    const result = await db.query("SELECT * FROM invoice WHERE id = $1", [id]);
    return result.rows[0];
  }

  // Mise à jour d'une facture (uniquement certains champs)
  static async update(id, data) {
    const query = `
      UPDATE invoice 
      SET cust_id = $1, inv_date = $2, inv_duedate = $3 
      WHERE id = $4 
      RETURNING *
    `;
    const values = [data.cust_id, data.inv_date, data.inv_duedate, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Création d'une ligne de détail pour une facture
  static async createInvoiceDetail(invoiceId, itemId, lineNumber, qty, discount, price, vat_percentage) {
    await db.query(
      "INSERT INTO invoicedetail (invoice_id, item_id, vattype_id, line_number, qty, price, discount, vat_percentage) VALUES ($1, $2, 1, $3, $4, $5, $6, $7)",
      [invoiceId, itemId, lineNumber, qty, price, discount, vat_percentage]
    );
  }
}

export default Invoice;
