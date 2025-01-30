import db from "../configs/database.js";

class Item{
    static async fetchItemVatById(id){
        try {
            const result = await db.query("SELECT i.id, i.item_label, i.item_description, i.item_retail_price, v.vat_percentage  FROM item AS i INNER JOIN vattype AS vt ON i.vat_type_id = vt.id INNER JOIN vat AS v ON v.vat_type_id = vt.id WHERE i.id = $1", [id]);
            return result.rows;
        } catch (error) {
            console.log(error);
        }
    }
    static async fetchItemByItemNumber(itemNumber){
        try {
            const result = await db.query("SELECT * FROM item WHERE item_number = $1", [itemNumber]);
            return result.rows;
        } catch (error) {
            console.log(error);
        }
    }
    static async fetchItemByItemEan(itemEan){
        try {
            const result = await db.query("SELECT * FROM item WHERE item_ean = $1", [itemEan]);
            return result.rows;
        } catch (error) {
            console.log(error);
        }
    }
    static async fetchItemByItemLabel(itemLabel){
        try {
            const result = await db.query("SELECT * FROM item WHERE item_label = $1", [itemLabel]);
            return result.rows;
        } catch (error) {
            console.log(error);
        }
    }
}
export default Item;