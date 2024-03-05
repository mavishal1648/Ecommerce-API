import productModel from "../product/product.model.js";
import UserModel from "../user/user.model.js";
//product Id,userId,quantity

export default class cartModel{
    constructor(productId,userId,quantity,id){
        this.productId = productId;
        this.userId = userId;
        this.quantity = quantity;
        this.id = id;
    }

    static addItems(productId,userId,quantity){
        console.log(productId,userId,quantity);
        const product = productModel.getALLProducts().find((p)=>p.id==productId);
        if(!product){
            return {
                status:false,
                msg:'product not found!'
            }
        };
        const user = UserModel.getAll().find((u)=>u.id == userId);
        console.log(user)
        if(!user){
            return {
                status:false,
                msg:'user not found!'
            }
        }
        if(quantity<=0){
            return {
                status:false,
                msg:'invalid quantity!'
            }
        }
        const cartItem = new cartModel(productId,userId,quantity);
        cartItem.id = cartItems.length+1;
        cartItems.push(cartItem);
        return {
            status:true,
            msg:cartItem
        }
    }

    static get(userId){
        return cartItems.filter((c)=>c.userId==userId);
    }

    static delete(cartItemId,userId){

        const cartItemIndex = cartItems.findIndex((i)=>i.id==cartItemId && i.userId==userId);
        if(cartItemIndex==-1){
            return 'Item is not found!'
        }
        else{
            cartItems.splice(cartItemIndex,1);
        }
        
       
    }
}

let cartItems = [
    new cartModel(1,2,1,1),
    new cartModel(2,1,2,2),
]