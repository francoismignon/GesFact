import Item from "../models/item.js";

class ItemController {
  // Affichage de la liste des articles
  static async showListItems(req, res) {
    try {
      const items = await Item.fetchAllItems();
      res.render("items.ejs", { items });
    } catch (error) {
      console.log(error);
    }
  }

  // Affichage du formulaire d'ajout d'un article
  static async showAddItemForm(req, res) {
    const lastItemNumber = await Item.fetchLastItemNumber();
    const arrayTvaTypeAndValue = await Item.fetchAllTvaTypeWithValue();
    console.log(arrayTvaTypeAndValue);
    // console.log(lastItemNumber.length);
    if (lastItemNumber.length === 0) {
      console.log("le tableau est vide");
    }
    // console.log(typeof(lastItemNumber.item_number))
    res.render("itemForm.ejs", { 
      mode: "add", 
      item: null,
      itemNumber : lastItemNumber.length === 0?2000:parseInt(lastItemNumber[0].item_number) + 1,
      tvaAndValues: arrayTvaTypeAndValue
    });
  }

  // Ajout d'un article
  static async addItem(req, res) {
    try {
      await Item.create(req.body);
      console.log(req.body);
      res.redirect("/items");
    } catch (error) {
      console.log(error);
    }
  }

  // Affichage du formulaire d'édition d'un article
  static async showEditItemForm(req, res) {
    try {
      const id = req.params.id;
      const itemArray = await Item.fetchItemById(id);
      const arrayTvaTypeAndValue = await Item.fetchAllTvaTypeWithValue();
      const item = itemArray[0];
      console.log(item.vat_type_id);
      console.log(arrayTvaTypeAndValue[0].vat_type_id);
      res.render("itemForm.ejs", { 
        mode: "edit", 
        item,
        tvaAndValues: arrayTvaTypeAndValue
       });
    } catch (error) {
      console.log(error);
    }
  }

  // Mise à jour d'un article
  static async updateItem(req, res) {
    try {
      const id = req.params.id;
      await Item.update(id, req.body);
      res.redirect("/items");
    } catch (error) {
      console.log(error);
    }
  }
}

export default ItemController;
