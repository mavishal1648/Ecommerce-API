import cartModel from "./cart.model.js";
export default class cartController{
    add(req,res){
        const {productId,quantity} = req.query;
        const userId = req.userId;
        const cart = cartModel.addItems(productId,userId,quantity);
        if(!cart.status){
            return res.status(400).send(cart)
        }
        else{
            res.status(200).json({
                res:cart,
                msg:"cart item added successfully"
            })
        }
    }
    get(req,res){
        const userId = req.userId;
        const items = cartModel.get(userId);
         return res.status(200).send(items);
    }

    delete(req,res){
        const userId = req.userId;
        const cartId = req.params.id;  
        const error = cartModel.delete(cartId,userId);
        if(error){
            res.status(400).json({
                status:false,
                msg:'Id not found!'
            })
        }
        else{
            res.status(200).json({
                status:true,
                msg:'cardItem deleted!'
            })
        }
    }
}