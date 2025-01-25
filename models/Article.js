class Article{
    constructor(id, vatTypeId, unitId, classId, itemNumber, itemEan, itemLabel, itemDesc, itemRetailPrice){
        this.id = id;
        this.vatTypeId = vatTypeId;
        this.unitId = unitId;
        this.classId = classId;
        this.itemNumber = itemNumber;
        this.itemEan = itemEan;
        this.itemLabel = itemLabel;
        this.itemDesc = itemDesc;
        this.itemRetailPrice = itemRetailPrice;
    }
}
export default Article;