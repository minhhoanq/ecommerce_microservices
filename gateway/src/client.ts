const PROTO_PATH_USER = "./src/proto/user.proto";
const PROTO_PATH_PRODUCT = "./src/proto/product.proto";

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const packageDefinitionUser = protoLoader.loadSync(PROTO_PATH_USER, {
    keepCase: true,
    longs: String,
    enums: String,
    oneofs: true,
});

const packageDefinitionProduct = protoLoader.loadSync(PROTO_PATH_PRODUCT, {
    keepCase: true,
    longs: String,
    enums: String,
    oneofs: true,
});

const UserService: any = grpc.loadPackageDefinition(
    packageDefinitionUser
).UserService;

const ProductService: any = grpc.loadPackageDefinition(
    packageDefinitionProduct
).ProductService;

const clientUser = new UserService(
    "127.0.0.1:30043",
    grpc.credentials.createInsecure()
);

const clientProduct = new ProductService(
    "127.0.0.1:30044",
    grpc.credentials.createInsecure()
);

export { clientUser, clientProduct };
