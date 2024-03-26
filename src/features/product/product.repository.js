import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import applicationError from "../error-handler/applicationError.js";


class productRepository {
  async add(newProduct) {
    try {
      // 1. get the database
      const db = getDB();
      // 2. add collection to the database...
      const collection = db.collection("products");
      // 3. add document to the collection
      await collection.insertOne(newProduct);
      return newProduct;
    } catch (e) {
      console.log(e);
      throw new applicationError("Something went wrong with database for adding product!", 500);
    }
  }
  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection("products");
      return await collection.find().toArray();
    } catch (e) {
      console.log(e);
      throw new applicationError("Something went wrong with database!", 500);
    }
  }
  async get(id) {
    try {
        const db = getDB();
        const collection = db.collection("products");
        return await collection.findOne({_id:new ObjectId(id)});
      } catch (e) {
        console.log(e);
        throw new applicationError("Something went wrong with database!", 500);
      }
  }
  
  async filter(minPrice,categories){
    try{
      const db = getDB();
      const collection = db.collection("products");
      let filterExpression = {};
      if(minPrice){
        filterExpression.price = {$gte:parseFloat(minPrice)};
      }
      // if(maxPrice){
      //   filterExpression.price = {...filterExpression.price,$lte:parseFloat(maxPrice)};
      // }
      categories = JSON.parse(categories.replace(/'/g,'"'))
      if(categories){
        filterExpression={$or:[{category:{$in:categories}},filterExpression]}
        // filterExpression.category = category;
      }
      return await collection.find(filterExpression).toArray();
    }catch(e){
      console.log(e);
      throw new applicationError("Something went wrong with database yipee!", 500);
    }
  }

  // async rate(userId,productId,rating){
  //   try{
  //     const db = getDB();
  //     const collection = db.collection("products");

  //     // 1. find the product...
  //     const product = await collection.findOne({_id:new ObjectId(productId)})
  //     // 2.Find the rating
  //     const userRating = product?.ratings?.find(r=>r.userId==userId);
  //     if(userRating){
  //       //3. update the rating

  //       // first we are finding the product then we are finding the ratings inside that product..
  //       // once we find the rating then we are setting the rating with our rating...$ is used to find the first rating based on the filter which we provided..the first found one it will update..thats why ratings.$.rating

        // await collection.updateOne({_id:new ObjectId(productId),"ratings.userId":new ObjectId(userId)},{
        //   $set:{
        //     "ratings.$.rating":rating
        //   }
        // })
  //     }
  //     else{
  //       await collection.updateOne({
  //         _id:new ObjectId(productId),
  //       },{
  //         $push:{ratings:{userId:new ObjectId(userId),rating}}
  //       })
  //     }
      
  //   }catch(e){
  //     console.log(e);
  //     throw new applicationError("Something went wrong with database!", 500);
  //   }
  // }


  async rate(userId,productId,rating){
    try{
      const db = getDB();
      const collection = db.collection("products");
      // 1. Remove existing entry if not there no error will be shown...race condition thats why
      await collection.updateOne({_id:new ObjectId(productId)},{
        $pull:{ratings:{userId:new ObjectId(userId)}}
      })
      // 2. add new entry      
      await collection.updateOne({
        _id:new ObjectId(productId),
      },{
        $push:{ratings:{userId:new ObjectId(userId),rating}}
      })
    }catch(e){
      console.log(e);
      throw new applicationError("Something went wrong with database!", 500);
    }
  }

  async averageProductPricePerCategory(){
    try{
      const db = getDB();
      const collection = db.collection("products");
      return await collection.aggregate([
        {
          //Stage 1: get average price per category
          $group:{
            _id:"$category",
            averagePrice:{$avg:"$price"}
          }
        }
      ]).toArray();
    }catch(e){
      console.log(e);
      throw new applicationError("Something went wrong with database!", 500);
    }
  }
  async averageRating(){
    try{
      const db = getDB();
      const collection = db.collection("products");
      return await collection.aggregate([
        {
          $unwind:"$ratings"
        },
        {
          $addFields:{
            "ratings.rating":{$toDouble:"$ratings.rating"}
          }
        },
        {
          $group:{
              _id:"$name",
              averageRating:{$avg:"$ratings.rating"}
          }
        },
        {
          $sort:{averageRating:-1}
        },
        {
          $limit:2
        }

      ]).toArray();
    }catch(e){
      console.log(e);
      throw new applicationError("Something went wrong with database!", 500);
    }
  }
}
export default productRepository;
