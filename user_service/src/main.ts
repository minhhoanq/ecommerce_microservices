import { decode_token } from "./helpers/jwt";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";

const PROTO_PATH = "./src/proto/user.proto";

var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

var userProto: any = grpc.loadPackageDefinition(packageDefinition);

// const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();
// const users = [
//     {
//         id: 1,
//         name: "John Bolton",
//         age: 23,
//     },
//     {
//         id: 1,
//         name: "Mary Anne",
//         age: 45,
//     },
// ];

export const userService = new UserService(new UserRepository());

server.addService(userProto.UserService.service, {
    RegisterUser: async (
        call: any,
        callback: (_: any, callback: any) => void
    ) => {
        const { client_agent, client_ip, ...data } = call.request;
        console.log(call.request);
        console.log(data);
        console.log(client_agent);
        console.log(client_ip);
        const register = await userService.register(
            data,
            client_ip,
            client_agent
        );

        callback(null, register);
    },

    getUsers: async (_: any, callback: (_: any, callback: any) => void) => {
        const users = await userService.getUsers();

        callback(null, users);
    },

    GetSessionUser: async (
        call: any,
        callback: (_: any, callback: any) => void
    ) => {
        const { email, client_agent, client_ip } = call.request;
        const session = await userService.getSessionUser(
            email,
            client_agent,
            client_ip
        );
        // console.log(session);
        callback(null, session);
    },

    DecodeToken: async (
        call: any,
        callback: (_: any, callback: any) => void
    ) => {
        // console.log(call.request);
        const { token, key } = call.request;
        const decode_user = await decode_token(token, key);

        callback(null, decode_user);
    },
});

server.bindAsync(
    "127.0.0.1:30043",
    grpc.ServerCredentials.createInsecure(),
    () => {
        server.start();
        console.log("Server running at http://127.0.0.1:30043");
    }
);
