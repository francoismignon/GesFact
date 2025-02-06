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
  static showAddItemForm(req, res) {
    res.render("itemForm.ejs", { mode: "add", item: null });
  }

  // Ajout d'un article
  static async addItem(req, res) {
    try {
      await Item.create(req.body);
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
      const item = itemArray[0];
      res.render("itemForm.ejs", { mode: "edit", item });
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
