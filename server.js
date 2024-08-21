const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const { ReflectionService } = require('@grpc/reflection');

const productController = require("./src/controllers/productController");
const orderController = require("./src/controllers/orderController");

const PROTO_PATH_PRODUCTS = "./src/proto/products.proto";
const PROTO_PATH_ORDERS = "./src/proto/orders.proto";


const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinitionProducts = protoLoader.loadSync(PROTO_PATH_PRODUCTS, options);
const productsProto = grpc.loadPackageDefinition(packageDefinitionProducts);

var packageDefinitionOrders = protoLoader.loadSync(PROTO_PATH_ORDERS, options);
const ordersProto = grpc.loadPackageDefinition(packageDefinitionOrders);

const server = new grpc.Server();
const serverOrders = new grpc.Server();

const reflectionProducts = new ReflectionService(packageDefinitionProducts);
const reflectionOrders = new ReflectionService(packageDefinitionOrders);


server.addService(productsProto.ProductsService.service, {
  GetProducts: (call, callback) => {
    productController.getProducts(call, callback);
  },

  GetProduct: (call, callback) => {
    productController.getProduct(call, callback);
  },

  CreateProducts: (call, callback) => {
    productController.createProduct(call, callback);
  },

  UpdateProducts: (call, callback) => {
    productController.updateProduct(call, callback);
  },

  DeleteProducts: (call, callback) => {
    productController.deleteProduct(call, callback);
  },
});

serverOrders.addService(ordersProto.OrdersService.service, {
  CreateOrders: (call, callback) => {
    orderController.createOrder(call, callback);
  },
});

reflectionProducts.addToServer(server);
reflectionOrders.addToServer(serverOrders);

server.bindAsync(
  "127.0.0.1:5000",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:5000");
  }
);

serverOrders.bindAsync(
  "127.0.0.1:5001",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:5001");
  }
);