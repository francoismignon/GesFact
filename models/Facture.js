class Facture {
    constructor(custId, invNum, invDate, invDueDate, invVatMount, invVatBaseMount, invDetail){
        this.custId = custId;
        this.invNum = invNum;
        this.invDate = invDate;
        this.invDueDate = invDueDate;
        this.invVatMount = invVatMount;
        this.invVatBaseMount = invVatBaseMount;
        this.invDetail = invDetail;
    }
}
export default Facture;