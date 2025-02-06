import db from "../configs/database.js";

class Item {
  // Récupération de tous les articles avec les informations de TVA associées
  static async fetchAllItemsWithVat() {
    const items = await db.query(
      "SELECT i.id, i.vat_type_id, i.item_number, i.item_ean, i.item_label, i.item_description, i.item_retail_price, v.vat_percentage FROM item AS i INNER JOIN vattype AS vt ON i.vat_type_id = vt.id INNER JOIN vat AS v ON v.vat_type_id = vt.id");
      console.log(items.rows);
    return items.rows;
  }

  // Récupération d'un articles specifique avec les informations de TVA associées
  static async fetchItemByIdWithVat(id) {
    const items = await db.query(
      "SELECT i.id, i.vat_type_id, i.item_number, i.item_ean, i.item_label, i.item_description, i.item_retail_price, v.vat_percentage FROM item AS i INNER JOIN vattype AS vt ON i.vat_type_id = vt.id INNER JOIN vat AS v ON v.vat_type_id = vt.id WHERE i.id = $1", [id]);
    return items.rows;
  }

  // Récupération de tous les articles
  static async fetchAllItems() {
    const items = await db.query("SELECT * FROM item");
    return items.rows;
  }

  // Récupération d'un article par son ID
  static async fetchItemById(id) {
    const item = await db.query("SELECT * FROM item WHERE id = $1", [id]);
    return item.rows;
  }

  // Création d'un article
  static async create(data) {
    const query = `
      INSERT INTO item (item_number, item_ean, item_label, item_retail_price, vat_type_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      data.item_number,
      data.item_ean,
      data.item_label,
      data.item_retail_price,
      data.vat_type_id || 1
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Mise à jour d'un article
  static async update(id, data) {
    const query = `
      UPDATE item 
      SET item_number = $1, item_ean = $2, item_label = $3, item_retail_price = $4, vat_type_id = $5
      WHERE id = $6
      RETURNING *
    `;
    const values = [
      data.item_number,
      data.item_ean,
      data.item_label,
      data.item_retail_price,
      data.vat_type_id || 1,
      id
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }
}

export default Item;
