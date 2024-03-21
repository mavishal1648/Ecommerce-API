import express from 'express'
import cartController from './cart.controller.js'


const cartRouter = express.Router();

const cartControllers = new cartController();

cartRouter.post("/",(req,res)=>{
    cartControllers.add(req,res);
});
cartRouter.get("/",(req,res)=>{
    cartControllers.get(req,res);
});
cartRouter.delete('/:id',(req,res)=>{
    cartControllers.delete(req,res);
});   

export default cartRouter;