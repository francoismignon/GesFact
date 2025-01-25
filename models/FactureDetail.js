class FactureDetail{
    constructor(invId, itemId, vatTypeId, lineNumber, qty, price, discount, vatPercentage, description){
        this.invId = invId;
        this.itemId = itemId;
        this.vatTypeId = vatTypeId;
        this.lineNumber = lineNumber;
        this.qty = qty;
        this.price = price;
        this.discount = discount;
        this.vatPercentage = vatPercentage;
        this.description = description;
    }
}
export default FactureDetail;