const db = require("../db");

class OrderSaleController {
  async createOrderSale(order_id, product_id) {
    try {

      const productAvailable = await this.checkProductQuantity(product_id, 1);

      if (!productAvailable) {
        return {success: null, fail: `One product with id ${product_id} is not available`};
      }

      const [id] = await db("order_sales").insert({order_id, product_id});
      const orderSale = await db("order_sales").where({id}).first();

      await this.updateProductQuantity(product_id, -1);

      return {success: orderSale, fail: null};
    } catch (error) {
      return {success: null, fail: error};
    }
  }

  async updateProductQuantity(product_id, quantity) {
    try {
      const product = await db("products").where({id: product_id}).first();

      await db("products").where({id: product_id}).update({quantity: product.quantity + quantity});
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkProductQuantity(product_id, quantity) {
    try {
      const product = await db("products").where({id: product_id}).first();
      if (product.quantity >= quantity) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}

module.exports = new OrderSaleController();