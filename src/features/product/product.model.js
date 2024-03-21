export default class productModel{
    constructor(name,description,price,imageURL,category,sizes,id){
      this.name = name;
      this.description = description;
      this.price = price;
      this.imageURL = imageURL;
      this.category = category;
      this.sizes = sizes;
      this._id = id;
    };
  }