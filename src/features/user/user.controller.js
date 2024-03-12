import jwt from "jsonwebtoken";
import UserModel from "./user.model.js";
import applicationError from "../error-handler/applicationError.js";
import userRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new userRepository();
  }

  async signUp(req, res) {
    try {
      const { name, email, password, type } = req.body;
      const hashPassword = await bcrypt.hash(password, 12);
      const user = new UserModel(name, email, hashPassword, type);
      await this.userRepository.signUp(user);
      console.log(user);
      res.status(201).send(user);
    } catch (e) {
      console.log(e);
      throw new applicationError("something went wrong!", 500);
    }
  }

  async signIn(req, res) {
    try {
      const user = await this.userRepository.findByEmail(req.body.email);
      if (!user) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        //compare password with hashed password...
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          const token = jwt.sign(
            {
              userID: result.id,
              email: result.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
          res.status(200).send(token);
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send("something went wrong!");
    }
  }
  getUser(req, res) {
    const users = UserModel.getAll();
    console.log(users);
    return res.status(200).send(users);
  }
}
