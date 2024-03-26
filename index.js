import dotenv from 'dotenv'
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import swagger from "swagger-ui-express";
import cors from 'cors'


import apiDocs from "./swagger.json" assert{type:'json'};
import jwtAuth from "./src/middleware/jwt.middleware.js";
import loggerMiddleware from "./src/middleware/logger.middleware.js ";
import applicationError from "./src/features/error-handler/applicationError.js";
import productRouter from "./src/features/product/products.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import cartRouter from "./src/features/cart/cart.routes.js";
import orderRouter from './src/features/order/order.router.js';
import {connectToMongoDB} from "./src/config/mongodb.js";
import { connectUsingMongoose } from './src/config/mongoose.js';

const server = express();



//CORS Policy config
var corsOptions = {
    origin:'http://localhost:5500/index.html',
}
server.use(cors());

server.use(bodyParser.json());

server.use("/api-docs",swagger.serve,swagger.setup(apiDocs));

server.use(loggerMiddleware);

server.use("/api/products",jwtAuth,productRouter);
server.use("/api/users",userRouter);
server.use('/api/carts',jwtAuth,cartRouter);
server.use('/api/orders',jwtAuth,orderRouter)
server.get('/',(req,res)=>{
    res.send('Welcome to Ecommerce APIs');
})


server.use((req,res)=>{
    res.status(404).send('Api not found, Please check out documentation for more information localhost:3200/api-docs');
})

server.use((err,req,res,next)=>{
    console.log(err);
    if(err instanceof applicationError){
        return res.status(err.code).send(err.message)
    }
    res.status(500).send("Something went wrong, pls try later")
})

server.listen(3200,()=>{
    console.log('Server is listening to port 3200');
    // connectToMongoDB();
    connectUsingMongoose()
});
