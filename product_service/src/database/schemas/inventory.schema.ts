import { Schema, Types, model } from "mongoose";

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventorys";

const inventorySchema = new Schema(
    {
        inven_product_id: { type: Types.ObjectId, ref: "Product" },
        inven_location: { type: String, default: "unKnow" },
        inven_stock: { type: Number, required: true },
        inven_shop_id: { type: Number, ref: "Shop" },
        inven_reservations: { type: Array, default: [] },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const inventory = model(DOCUMENT_NAME, inventorySchema);

export { inventory };
