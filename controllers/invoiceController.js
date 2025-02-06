import Invoice from "../models/invoice.js";
import Customer from "../models/customer.js";
import Item from "../models/item.js";

class InvoiceController {
  // Ajout d'une facture
  static async addInvoice(req, res) {
    try {
      // Récupération des données du formulaire
      const data = {
        cust_id: req.body.cust_id,
        inv_date: req.body.date_emission,
        inv_duedate: req.body.date_echeance
      };

      // Calcul de la date d'échéance par défaut (30 jours après)
      if (!data.inv_duedate) {
        const dateEmission = new Date(data.inv_date);
        dateEmission.setDate(dateEmission.getDate() + 30);
        data.inv_duedate = dateEmission;
      }

      // Création de la facture
      const invoice = new Invoice(data);
      await invoice.create();
      const invoiceId = invoice.id; // on récupère l'id de la facture créée

      // Récupération des articles
      let itemIds = req.body.selectItem;
      let quantities = req.body.qty;
      let discounts = req.body.discount;

      // S'assurer que les valeurs sont des tableaux (si une seule ligne, convertir en tableau)
      if (!Array.isArray(itemIds)) {
        quantities = [quantities];
        discounts = [discounts];
      }

      // Création des lignes de détails de la facture
      for (let i = 0; i < itemIds.length; i++) {
        const itemId = itemIds[i];
        const qty = parseFloat(quantities[i]);
        const discount = parseFloat(discounts[i]);
        const item = await Item.fetchItemByIdWithVat(itemId);
        const price = item[0].item_retail_price;
        const vat_percentage = parseFloat(item[0].vat_percentage);
        console.log(item[0].vat_percentage);
        const totalLine = price * qty * (1 - discount / 100);
        // Création de la ligne de détail dans la facture
        await Invoice.createInvoiceDetail(invoiceId, itemId, i + 1, qty ,discount, totalLine, vat_percentage);
      }

      res.redirect('/invoices'); // Redirection vers la liste des factures
    } catch (error) {
      console.log(error);
    }
  }

  // Affichage du formulaire d'ajout de facture
  static async showAddInvoiceForm(req, res) {
    try {
      const customers = await Customer.fetchAllCustomers();
      const items = await Item.fetchAllItemsWithVat();
      console.log(items);
      res.render("invoicesForm.ejs", {
        customers,
        items,
        mode: "add",
        invoice: null // aucune facture existante lors de l'ajout
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Affichage de la liste des factures avec tri et recherche
  static async showListInvoices(req, res) {
    try {
      const search = req.query.search;
      const sort = req.query.sort;
      let invoices = [];
      switch (sort) {
        case "date":
          invoices = await Invoice.fetchInvoiceByInvoiceDate(search);
          break;
        case "number":
          invoices = await Invoice.fetchInvoiceByInvoiceNumber(search);
          break;
        default:
          invoices = await Invoice.fetchAllInvoicesWithLinkCustomer();
          break;
      }
      res.render("invoices.ejs", {
        invoices,
        search,
        sort
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Affichage du formulaire d'édition (uniquement si la facture n'est pas comptabilisée)
  static async showEditInvoiceForm(req, res) {
    try {
      const id = req.params.id;
      const invoice = await Invoice.fetchInvoiceById(id);
    //   console.log(invoice);
      // Vérifier que la facture existe et n'est pas comptabilisée (flag_accounting == 0)
    //   if (!invoice || invoice.flag_accounting != 0) {
    //     return res.redirect('/invoices');
    //   }
      const customers = await Customer.fetchAllCustomers();
      const items = await Item.fetchAllItemsWithVat();
    //   console.log(items);
      console.log(customers);
    //   res.render("invoicesForm.ejs", {
    //     customers,
    //     items,
    //     mode: "edit",
    //     invoice
    //   });
    } catch (error) {
      console.log(error);
    }
  }

  // Mise à jour de la facture
  static async updateInvoice(req, res) {
    try {
      const id = req.params.id;
      const invoice = await Invoice.fetchInvoiceById(id);
      // Seules les factures non comptabilisées peuvent être modifiées
      if (!invoice || invoice.flag_accounting != 0) {
        return res.redirect('/invoices');
      }
      // Récupération et traitement des données du formulaire
      const data = {
        cust_id: req.body.cust_id,
        inv_date: req.body.date_emission,
        inv_duedate: req.body.date_echeance || new Date(new Date(req.body.date_emission).setDate(new Date(req.body.date_emission).getDate() + 30))
      };
      await Invoice.update(id, data);

      // Optionnel : mettre à jour les lignes de détails si nécessaire

      res.redirect('/invoices');
    } catch (error) {
      console.log(error);
    }
  }
}

export default InvoiceController;
