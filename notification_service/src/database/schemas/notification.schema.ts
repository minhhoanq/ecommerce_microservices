import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

const notificationSchema = new Schema(
    {
        type: { type: String, require: true },
        senderId: { type: Number, require: true },
        receiverIds: [
            {
                userId: { type: Number, require: true },
            },
        ],
        content: { type: String, require: true },
        isRead: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const notification = model(DOCUMENT_NAME, notificationSchema);

export { notification };
