const PROTO_PATH_USER = "./src/proto/user.proto";
const PROTO_PATH_PRODUCT = "./src/proto/product.proto";
require("dotenv").config();

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

function startHTTPServer(proto_path: any, port_grpc: number, type: any) {
    const packageDefinition = protoLoader.loadSync(proto_path, {
        keepCase: true,
        longs: String,
        enums: String,
        oneofs: true,
    });
    let Service: any;
    switch (type) {
        case "ProductService":
            Service =
                grpc.loadPackageDefinition(packageDefinition).ProductService;
            break;
        case "UserService":
            Service = grpc.loadPackageDefinition(packageDefinition).UserService;
            break;
        default:
            break;
    }
    const client = new Service(
        `127.0.0.1:${port_grpc}`,
        grpc.credentials.createInsecure()
    );
    console.log(`Connected to grpc server at PORT: ${port_grpc}`);
    return client;
}

const clientUser = startHTTPServer(
    PROTO_PATH_USER,
    Number(process.env.PORT_GRPC_USER),
    "UserService"
);
const clientProduct = startHTTPServer(
    PROTO_PATH_PRODUCT,
    Number(process.env.PORT_GRPC_PRODUCT),
    "ProductService"
);

export { clientUser, clientProduct };
