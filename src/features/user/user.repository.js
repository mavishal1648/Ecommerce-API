import { getDB } from "../../config/mongodb.js";
import applicationError from "../error-handler/applicationError.js";

class userRepository {
  async signUp(newUser) {
    try {
      // 1.Get the DataBase
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection("users");
      // 3. Insert the document
      await collection.insertOne(newUser);
      return newUser;
    } catch (e) {
      throw new applicationError("Something went wrong with database!", 500);
    }
  }
  async findByEmail(email) {
    try {
      // 1.Get the DataBase
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection("users");
      // 3. find the document
      return await collection.findOne({email});
    } catch (e) {
      throw new applicationError("Something went wrong with database!", 500);
    }
  }
}
export default userRepository;
