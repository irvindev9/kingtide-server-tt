const db = require("../db");
const orderSaleController = require("./orderSaleController");

class OrderController {
  async getOrders(_, callback) {
    try {
      const orders = await db("orders").select("*");
      callback(null, {orders});
    } catch (error) {
      callback(error, null);
    }
  }

  async getOrder(call, callback) {
    try {
      const { id } = call.request;
      const order = await db("orders").where({id}).first();
      callback(null, {...order});
    } catch (error) {
      callback(error, null);
    }
  }

  async createOrder(call, callback) {
    try {
      const { client_name, sale_date, order_sales } = call.request;
      let sale_date_formatted_mysql = new Date(sale_date);
      sale_date_formatted_mysql = sale_date_formatted_mysql.toISOString().slice(0, 19).replace('T', ' ');

      const [id] = await db("orders").insert({client_name, sale_date: sale_date_formatted_mysql});

      let failMessage = "";

      for (let i = 0; i < order_sales.length; i++) {
        const order_sale = order_sales[i];
        const { success, fail } = await orderSaleController.createOrderSale(id, order_sale.product_id);
        if (fail) {
          failMessage += fail + "\n";
        }
      }

      if (failMessage == "") { 
        failMessage = "All products were successfully added to the order";
      } else {
        failMessage += "The other products were added to the order";
      }

      const order = await db("orders").where({id}).first();
      callback(null, {responseMessage: failMessage});
    } catch (error) {
      callback(error, null);
    }
  }

  async updateOrder(call, callback) {
    try {
      const { id, product_id, quantity } = call.request;
      await db("orders").where({id}).update({product_id, quantity});
      const order = await db("orders").where({id}).first();
      callback(null, {...order});
    } catch (error) {
      callback(error, null);
    }
  }

  async deleteOrder(call, callback) {
    try {
      const { id } = call.request;
      const order = await db("orders").where({id}).first();
      await db("orders").where({id}).delete();
      callback(null, {...order});
    } catch (error) {
      callback(error, null);
    }
  }
}

module.exports = new OrderController();