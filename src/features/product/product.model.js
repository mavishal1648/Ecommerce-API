import applicationError from "../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";
export default class productModel{
    constructor(id,name,description,price,imageURL,category,sizes){
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageURL = imageURL;
        this.category = category;
        this.sizes = sizes;
    };

    static getALLProducts(){
        return products;
    }
    static addProduct(product){
        product.id = products.length+1;
        products.push(product);
        return products;
    }
    static get(id){
      const product =  products.find((p)=>p.id==id);
      return product;
    }
    static filter(minPrice, maxPrice, category) {
      const result = products.filter((product) => {
        return (
          (!minPrice || product.price >= minPrice) &&
          (!maxPrice || product.price <= maxPrice) &&
          (!category || product.category === category)
        );
      });
  
      return result;
    }

    static rateProduct(userId,productId,rating){
      // 1.validate user and product
      const user  = UserModel.getAll().find((u)=>u.id==userId) ;
      if(!user){
        throw new applicationError('User Not found',400);
      }
      const product = products.find(p=>p.id==productId);
      if(!product){
        throw new applicationError('Product Not found',400);
      }

      // 2. check if there are any rating if not add rating into the array
      if(!product.rating){
        product.rating = [];
        product.rating.push({
          userId:userId,
          rating:rating
        });
      }else{
        //3. check if user rating is already available given by the user;
        const existingRatingIndex = product.rating.findIndex(r=>r.userId==userId);
        if(existingRatingIndex>=0){
          product.rating[existingRatingIndex] = {
            userId:userId,
            rating:rating
          }
        }
        // 4. new user is giving an rating
        else{
          product.rating.push({
            userId:userId,
            rating:rating
          })
        }
      }
    }
}

var products = [
    new productModel(
      1,
      'Product 1',
      'Description for Product 1',
      19.99,
      'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
      'Category1'
    ),
    new productModel(
      2,
      'Product 2',
      'Description for Product 2',
      29.99,
      'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
      'Category2',
      ['M', 'XL']
    ),
    new productModel(
      3,
      'Product 3',
      'Description for Product 3',
      39.99,
      'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
      'Category3',
      ['M', 'XL','S']
    )];