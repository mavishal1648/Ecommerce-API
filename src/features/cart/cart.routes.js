import express from 'express'
import cartController from './cart.controller.js'


const cartRouter = express.Router();

const cartControllers = new cartController();

cartRouter.post("/",cartControllers.add);
cartRouter.get("/",cartControllers.get);
cartRouter.delete('/:id',cartControllers.delete);   

export default cartRouter;