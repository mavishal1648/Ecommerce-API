import jwt from "jsonwebtoken";
const jwtAuth = (req,res,next)=>{
    // console.log(req.headers);
    // 1. Read the token
    const token = req.headers['authorization'];
    console.log(token);
    //2. If no token return error
    if(!token){
        return res.status(401).send('unauthorized');
    }

    //3. check if token is valid or not
    try{
        const payLoad = jwt.verify(token,'LZ(MD=Ok)COHp!]')
        console.log(payLoad); 
        req.userId = payLoad.userID;
        // console.log(req.userId);
    }catch(err){
        //4. return error
        return res.status(401).send('unauthorized');
    }
   
    //5. call next middleware 
    next();
}
export default jwtAuth;