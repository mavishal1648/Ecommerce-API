// 1. Import express
import express from 'express'
import productController from './product.controller.js';
import {upload} from '../../middleware/fileUpload.middleware.js'
// 2. Initialize Express router
const productRouter = express.Router();

const productControllers = new productController();
// all the paths to controller methods
productRouter.get('/filter',(req,res)=>{
    productControllers.filterProducts(req,res);
});
productRouter.get('/',(req,res)=>{
    productControllers.getAllProducts(req,res);
});
productRouter.post('/',upload.single('imageUrl'),(req,res)=>{
    productControllers.addProduct(req,res);
});
productRouter.get('/averagePrice',(req,res)=>{
    productControllers.averagePrice(req,res); 
}); 
productRouter.post('/rate',(req,res)=>{
    productControllers.rateProduct(req,res);
});
productRouter.get('/one-product/:id',(req,res)=>{
    productControllers.getOneProduct(req,res);
});


export default productRouter;
