import db from "../configs/database.js";

class Item {
    static async fetchAllItemsWithVat(){
        const items = await db.query("SELECT * FROM item AS i INNER JOIN vattype AS vt ON i.vat_type_id = vt.id INNER JOIN vat AS v ON v.vat_type_id = vt.id");
        return items.rows;
    }
    static async fetchAllItems(){
        const items = await db.query("SELECT * FROM item");
        return items.rows;
    }
    static async fetchItemById(id){
        const item = await db.query("SELECT * FROM item WHERE id = $1", [id]);
        return item.rows
    }
}
export default Item;