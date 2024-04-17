const PROTO_PATH = "./src/proto/user.proto";

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    oneofs: true,
});

const UserService: any =
    grpc.loadPackageDefinition(packageDefinition).UserService;

const client = new UserService(
    "127.0.0.1:30043",
    grpc.credentials.createInsecure()
);

export default client;
