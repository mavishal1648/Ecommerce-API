import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import applicationError from "../error-handler/applicationError.js";


class cartRepository{
    async add(productId,userId,quantity){
        try{
            const db = getDB();
            const collection = db.collection("cart");
            const id = await this.getNextCounter(db);
            console.log(id);
            //find the document
            //either insert or update
            //insertion
            // upsert true will first check if it finds the document if find it updates or else it creates a new document
             await collection.updateOne (
                {productId:new ObjectId(productId),userId:new ObjectId(userId)},{
                    $setOnInsert:{_id:id},
                    $inc:{quantity:quantity}
                },
                {upsert:true}
                ); 
        }catch(e){
            console.log(e);
            throw new applicationError("Something wrong with the database!",500)
        }

    }
    async get(userId){
        try{
            const db = getDB();
            const collection = db.collection("cart");
            return await collection.find({userId:new ObjectId(userId)}).toArray();
        }catch(e){
            console.log(e);
            throw new applicationError("Something wrong with the database!",500)
        }
        
    }
    async delete(cartItemId,userId){
        try{
            const db = getDB();
            const collection = db.collection("cart");
            await collection.deleteOne({_id:new ObjectId(cartItemId),userId:new ObjectId(userId)})
        }catch(e){
            console.log(e);
            throw new applicationError("Something wrong with the database!",500)
        }
    }

    async getNextCounter(db){
        const resultDocument = await db.collection("counters").findOneAndUpdate(
            {_id:'cartItemId'},
            {$inc:{value: 1}},
            {returnDocument:'after'}
        );
        console.log(resultDocument);
        console.log(resultDocument.value);
        return resultDocument.value;
    }
}
export default cartRepository;