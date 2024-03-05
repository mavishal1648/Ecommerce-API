
import productModel from "./product.model.js";

export default class productController{

    getAllProducts(req,res){
        const products = productModel.getALLProducts();
        res.status(200).send(products);
    }
    
    addProduct(req,res){
        const {name,price,sizes} = req.body;
        console.log(name,price,sizes);
        const newProduct = {
            name,
            price:parseFloat(price),
            sizes:sizes.split(','),
            imageUrl : req.file.filename,
        };
        const products = productModel.addProduct(newProduct);
        res.status(201).send(products);
    }

    rateProduct(req,res){
        console.log(req.query);
        const userId = req.query.userId;
        const productId = req.query.productId;
        const rating = req.querys.rating;
        productModel.rateProduct(userId,productId,rating);
        return res.status(200).send('Rating has been added'); 
    }

    getOneProduct(req,res){
        const id = req.params.id;
        const Product = productModel.get(id);
        if(Product){
            res.status(200).send(Product);
        }
        else{
            res.status(404).send('Product Not Found');
        }
    }

    filterProducts(req,res){
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const category = req.query.category;
        console.log(minPrice,maxPrice,category);
        const result = productModel.filter(minPrice,maxPrice,category);
        console.log(result);
        res.status(200).send(result);
    }
   
}