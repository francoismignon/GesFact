import Item from "../models/item.js";

class ItemController{
    static async getItemBy(req, res){
        try {
            let items;
            switch (req.body.searchItem) {
                case "item_number":
                    items = await Item.fetchItemByItemNumber(req.body.searchItemField);
                    break;
                case "item_ean":
                    items = await Item.fetchItemByItemEan(req.body.searchItemField);
                    break;
                case "item_label":
                    items = await Item.fetchItemByItemLabel(req.body.searchItemField);
                default:
                    break;
            }
            res.render("facture.ejs", {items});
        } catch (error) {
            console.log(error);
        }
    }
}
export default ItemController;