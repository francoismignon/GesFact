import db from "../configs/database.js";

class Item{
    static async fetchAllItems(){}
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