import { Types } from "mongoose";
import { product } from "../database/schemas/product.schema";
import { insertInventory } from "../database/repositories/inventory_repo";

export class Product {
    product_name: string;
    product_thumb: string;
    product_price: number;
    product_quantity: number;
    product_desc: string;
    product_type: string;
    product_shop: string;
    product_attributes: any;
    constructor({
        product_name,
        product_thumb,
        product_price,
        product_quantity,
        product_desc,
        product_type,
        product_shop,
        product_attributes,
    }: Record<string, any>) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_desc = product_desc;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    async create(product_id: Types.ObjectId) {
        console.log(this);
        console.log("clothing id", product_id);
        const newProduct = await product.create({ _id: product_id, ...this });

        if (newProduct) {
            await insertInventory({
                product_id: newProduct._id,
                shop_id: this.product_shop,
                stock: this.product_quantity,
            });
        }
        return newProduct;
    }
}
