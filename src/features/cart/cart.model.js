//product Id,userId,quantity

export default class cartModel{
    constructor(productId,userId,quantity,id){
        this.productId = productId;
        this.userId = userId;
        this.quantity = quantity;
        this.id = id;
    }
}