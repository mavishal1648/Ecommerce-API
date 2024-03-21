import applicationError from "../error-handler/applicationError.js";
import cartModel from "./cart.model.js";
import cartRepository from "./cart.repository.js";
export default class cartController {
  constructor() {
    this.cartRepository = new cartRepository();
  }
  async add(req, res) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.userId;
      await this.cartRepository.add(productId, userId, quantity);
      res.status(201).send("Cart added successfully");
    } catch (e) {
      console.log(e);
      res.status(400).send("Cart not added!");
    }
  }
  async get(req, res) {
    try{
        const userId = req.userId;
        const items = await this.cartRepository.get(userId);
          return res.status(200).send(items);
    }catch (e) {
        console.log(e);
        res.status(400).send("couldnt get the cart items");
      }
    
  }

  async delete(req, res) {
    try{
        const userId = req.userId;
    const cartItemId = req.params.id;
    await this.cartRepository.delete(cartItemId,userId);
    res.status(200).send('Cart Items Deleted');
    }catch(e){
        console.log(e);
        res.status(400).send("couldnt delete the cart items");
    }
  }
}
