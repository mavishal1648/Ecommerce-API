import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";
import { getClient } from "../../config/mongodb.js";
export default class OrderRepository {
  async placeOrder(userId) {
    const client = getClient();
    const session = client.startSession();
    try {
        const db = getDB();
        session.startTransaction();
      // 1. get cart Items and calculate total amount
      const items = await this.getTotalAmount(userId,session);
      const finalAmount = items.reduce((acc, item) => {
        return (acc += item.totalAmount);
      }, 0);
      console.log(finalAmount);

      // 2. create an order record.
      const newOrder = new OrderModel(new ObjectId(userId),finalAmount,new Date()); 
      await db.collection("orders").insertOne(newOrder,{session});

      //3. Reduce the stock
      for(let item of items){
        await db.collection("products").updateOne(
            {_id:item.productId},
            {$inc:{stock:-item.quantity}},{session}
        )
      }
      // throw new Error("Something went wrong!");
      // 4. Clear the Cart
      await db.collection("cart").deleteMany({userId:new ObjectId(userId)},{session});
      await session.commitTransaction();
      session.endSession();
      return;

    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      console.log(e);
      throw new applicationError("Something went wrong with database!", 500);
    }  
  }

  async getTotalAmount(userId,session) {
    try {
      const db = getDB();
      const collection = db.collection("cart");
      const items = await collection
        .aggregate([
          {
            // get us all the cart item of the user
            $match: { userId: new ObjectId(userId) },
          },
          {
            // get the product from the products collection based on the id from cart collection..basically join in sql
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          {
            // unwind the productInfo
            $unwind: "$productInfo",
          },
          {
            //calculate the total amount
            $addFields: {
              totalAmount: {
                $multiply: ["$productInfo.price", "$quantity"],
              },
            },
          },
        ],{session}).toArray();
      return items;
    } catch (e) {
      console.log(e);
      throw new applicationError("Something went wrong with database!", 500);
    }
  }
}
