const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
import { Database } from "./database/init.mongodb";
import "reflect-metadata";
// import { NotificationHandlerFactory } from "./handlers/notification.handler";
import { INotification } from "./interfaces/notification.interface";
import { container } from "./inventories/inventory.config";
import { TYPES } from "./types/type";
Database.getInstance();
require("dotenv").config();

const PROTO_PATH = "./src/proto/service/notification.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const NotiService = container.get<INotification>(
    TYPES.NotificationHandlerFactory
);

const notificationProto: any = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();
server.addService(
    notificationProto.NotificationService.service,
    NotiService.notificationHandlers()
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
