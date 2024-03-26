import OrderRepository from "./order.repository.js"
export default class OrderController{
    constructor(){
        this.orderRepository = new OrderRepository();
    }

    async placeOrder(req,res){
        try{
            const userId = req.userId;
            await this.orderRepository.placeOrder(userId);
            return res.status(201).send("Order is Created")
        }catch(e){
            console.log(e);
            return res.status(500).send("something went wrong");
        }
    }
}