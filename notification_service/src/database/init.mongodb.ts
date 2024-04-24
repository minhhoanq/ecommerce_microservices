import mongoose from "mongoose";
import { configMongoDBDEV } from "../configs/mongo.config";
const connectString = `mongodb://${configMongoDBDEV.db.host}:${configMongoDBDEV.db.port}/${configMongoDBDEV.db.name}`;

export class Database {
    private static _instance: Database;

    constructor() {
        this.connect();
    }

    connect(type = "mongodb") {
        if (1 === 1) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }
        mongoose
            .connect(connectString, {
                maxPoolSize: 50,
            })
            .then((_) => console.log("Connection MongoDB Success."))
            .catch((err) => console.error(err));
    }

    static getInstance(): Database {
        if (!this._instance) {
            this._instance = new Database();
        }
        return this._instance;
    }
}
