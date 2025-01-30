import Item from "../models/item.js";

let itemsVat=[];
let items=[];

class ItemController{
    static async getItemVat(req, res){
        try {
            const itemVat = await Item.fetchItemVatById(req.body.id);
            itemsVat.push(itemVat[0]);
            res.render("facture.ejs", {itemsVat, items});
        } catch (error) {
            console.log(error);
        }
    }
    static async getItemBy(req, res){
        try {
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
            res.render("facture.ejs", {items, itemsVat});
        } catch (error) {
            console.log(error);
        }
    }
}
export default ItemController;