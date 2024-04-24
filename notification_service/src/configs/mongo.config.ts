require("dotenv").config();

export const configMongoDBDEV = {
    db: {
        host: process.env.DEV_DB_HOST || "localhost",
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || "notification_service",
    },
};
