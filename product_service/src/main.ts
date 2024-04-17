const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
import { ProductHandlerFatory } from "./handlers/product.handler";
import { Database } from "./database/init.mongodb";
Database.getInstance();
require("dotenv").config();

const PROTO_PATH = "./src/proto/product.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const productProto: any = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(
    productProto.ProductService.service,
    ProductHandlerFatory.productHandlers()
);

server.bindAsync(
    `127.0.0.1:${process.env.PORT_GRPC}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
        server.start();
        console.log(
            `Server running at http://127.0.0.1:${process.env.PORT_GRPC}`
        );
    }
);
