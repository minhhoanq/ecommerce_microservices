import { Types } from "mongoose";
import { inventory } from "../schemas/inventory.schema";

interface IProductInfo {
    shop_id: string | Types.ObjectId;
    product_id: Types.ObjectId;
    location?: string;
    stock: number;
}

export function insertInventory({
    shop_id,
    product_id,
    location = "unkown",
    stock,
}: IProductInfo) {
    return inventory.create({
        inven_product_id: product_id,
        inven_location: location,
        inven_stock: stock,
        inven_shop_id: shop_id,
    });
}
