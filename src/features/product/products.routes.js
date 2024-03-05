// 1. Import express
import express from 'express'
import productController from './product.controller.js';
import {upload} from '../../middleware/fileUpload.middleware.js'
// 2. Initialize Express router
const productRouter = express.Router();

const productControllers = new productController();
// all the paths to controller methods
productRouter.get('/filter',productControllers.filterProducts);
productRouter.get('/',productControllers.getAllProducts);
productRouter.post('/',upload.single('imageUrl'),productControllers.addProduct);
productRouter.get('/one-product/:id',productControllers.getOneProduct);
productRouter.post('/rate',productControllers.rateProduct);
export default productRouter;
