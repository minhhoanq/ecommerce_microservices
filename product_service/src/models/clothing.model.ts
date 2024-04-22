import { updateProductById } from "../database/repositories/product.repo";
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

    async update(product_id: string) {
        const product = await clothing.findOne({
            _id: product_id,
        });

        if (Number(product?.product_shop) !== Number(this.product_shop)) {
            throw new Error("you are not allowed!");
        }

        if (this.product_attributes) {
            console.log("Clothing Model", product_id, this.product_attributes);
            await updateProductById(
                product_id,
                this.product_attributes,
                clothing
            );
        }

        const updateProduct = await super.update(product_id, this);
        return updateProduct;
    }
}
