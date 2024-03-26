
import express from "express";
import OrderController from "./order.controller.js";

const orderRouter = express.Router();
const OrderControllers = new OrderController();
orderRouter.post('/',(req,res)=>{
    OrderControllers.placeOrder(req,res);
})

export default orderRouter;