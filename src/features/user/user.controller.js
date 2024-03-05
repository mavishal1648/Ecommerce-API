import jwt from 'jsonwebtoken';
import UserModel from './user.model.js';

export default class UserController {
  signUp(req, res) {
    const {
      name,
      email,
      password,
      type,
    } = req.body;
    const user = UserModel.signUp(
      name,
      email,
      password,
      type
    );
    console.log(user);
    res.status(201).send(user);
  }

  signIn(req, res) {
    const result = UserModel.signIn(
      req.body.email,
      req.body.password
    );
    if (!result) {
      return res
        .status(400)
        .send('Incorrect Credentials');
    } else {
      //create a token
      const token = jwt.sign({
        userID:result.id,
        email:result.email
      },'LZ(MD=Ok)COHp!]',{
        expiresIn:'1h'
      })
      return res.status(200).send(token);
    }
  }
  getUser(req,res){
    const users = UserModel.getAll();
    console.log(users);
    return res.status(200).send(users);
  }
}
