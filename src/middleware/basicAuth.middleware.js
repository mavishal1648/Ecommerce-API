
import UserModel from "../features/user/user.model.js";

export const basicAuth = (req,res,next)=>{

    const authHeader = req.headers['authorization'];
    if(!authHeader){
        return res.status(401).send('SignUp first,No Credentials found!');
    }
    console.log(authHeader); //[basic quereadfadfur....]


    const base64Cred = authHeader.replace('Basic','');
    console.log(base64Cred);

    const decodeCred = Buffer.from(base64Cred,'base64').toString('utf-8'); 
    //[email:password]
    const cred = decodeCred.split(':');
    // [email,password];
    console.log(cred);  

    const user = UserModel.getAll().find((u)=>u.email==cred[0] && u.password==cred[1]);
    if(user){
        next();
    }else{
        return res.status(401).send('Invalid Cred!');
    }
    
}