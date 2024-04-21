import { clothing } from "../database/schemas/product.schema";
import { Product } from "./product.model";

export class Clothing extends Product {
    async create() {
        const newClothing = await clothing.create({
            product_shop: this.product_shop,
            ...this.product_attributes,
        });
        if (!newClothing) {
            throw new Error("unable to create clothing");
        }

        const newProduct = await super.create(newClothing._id);
        if (!newProduct) {
            throw new Error("unable to create product");
        }

        return newProduct;
    }
}
