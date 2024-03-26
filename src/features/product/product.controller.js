import applicationError from "../error-handler/applicationError.js";
import productModel from "./product.model.js";
import productRepository from "./product.repository.js";

export default class productController {
  constructor() {
    this.productRepository = new productRepository();
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (e) {
      console.log(e);
      throw new applicationError("something went wrong!", 500);
    }
  }

  async addProduct(req, res) {
    try {
      const { name, price, sizes, description, category } = req.body;
      console.log(name,price,sizes,description,category);
      const imageUrl = req.file.filename;
      const newProduct = new productModel(
        name,
        description,
        parseFloat(price),
        imageUrl,
        category,
        sizes.split(",")
      );
      const products = await this.productRepository.add(newProduct);
      res.status(201).send(products);
    } catch (e) {
      console.log(e);
      throw new applicationError(
        "something went wrong with adding new product!",
        500
      );
    }
  }

  async rateProduct(req, res) {
    try {
      console.log(req.query);
      const userId = req.userId;
      const productId = req.body.productId;
      const rating = req.body.rating;
      await this.productRepository.rate(userId, productId, rating);
      return res.status(200).send("Rating has been added");
    } catch (e) {
      console.log(e);
      throw new applicationError("something went wrong with rateProduct!", 500);
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);
      if (product) {
        res.status(200).send(product);
      } else {
        res.status(404).send("Product Not Found");
      }
    } catch (e) {
      console.log(e);
      throw new applicationError(
        "something went wrong with getOneProduct!",
        500
      );
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      // const maxPrice = req.query.maxPrice;
      const categories = req.query.categories;

      const result = await this.productRepository.filter(
        minPrice,
        categories
      );
      res.status(200).send(result);
    } catch (e) {
      console.log(e);
      throw new applicationError(
        "something went wrong with filter products!",
        500
      );
    }
  }

  async averagePrice(req,res,next){
    try{
       const result =  await this.productRepository.averageProductPricePerCategory();
       res.status(200).send(result);
    }catch(e){
      console.log(e);
      throw new applicationError(
        "something went wrong with average price!",
        500
      );
    }
  }
  async averageRating(req,res,next){
    try{
       const result =  await this.productRepository.averageRating();
       res.status(200).send(result);
    }catch(e){
      console.log(e);
      throw new applicationError(
        "something went wrong with averageRating product!",
        500
      );
    }
  }
}
