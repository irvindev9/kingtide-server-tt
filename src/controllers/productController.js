const db = require("../db");

class ProductController {
  async getProducts(call, callback) {
    try {
      const products = await db("products").select("*");
      callback(null, {products});
    } catch (error) {
      callback(error, null);
    }
  }

  async getProduct(call, callback) {
    try {
      const { id } = call.request;
      const product = await db("products").where({id}).first();
      callback(null, {...product});
    } catch (error) {
      callback(error, null);
    }
  }

  async createProduct(call, callback) {
    try {
      console.log(call.request);
      const { name, price, quantity, description } = call.request;
      const [id] = await db("products").insert({name, price, quantity, description});
      const product = await db("products").where({id}).first();
      callback(null, {...product});
    } catch (error) {
      callback(error, null);
    }
  }

  async updateProduct(call, callback) {
    try {
      const { id, name, price, quantity, description } = call.request;
      await db("products").where({id}).update({name, price, quantity, description});
      const product = await db("products").where({id}).first();
      callback(null, {...product});
    } catch (error) {
      callback(error, null);
    }
  }

  async deleteProduct(call, callback) {
    try {
      const { id } = call.request;
      const product = await db("products").where({id}).first();
      await db("products").where({id}).delete();
      callback(null, {...product});
    } catch (error) {
      callback(error, null);
    }
  }
}

module.exports = new ProductController();