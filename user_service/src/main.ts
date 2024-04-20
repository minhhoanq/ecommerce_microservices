import { UserHandlerFactory } from "./handlers/user.handle";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
require("dotenv").config();

const PROTO_PATH = "./src/proto/user.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const userProto: any = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(
    userProto.UserService.service,
    UserHandlerFactory.userHandlers()
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
