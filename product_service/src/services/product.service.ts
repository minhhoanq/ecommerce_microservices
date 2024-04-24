import {
    getAllProduct,
    publishProductByShop,
    queryProduct,
    unPublishProductByShop,
} from "../database/repositories/product.repo";
import { Clothing } from "../models/clothing.model";

type ProductRegistry = typeof Clothing;
// | Electronic | Furniture
export class ProductFactory {
    static productRegistry = {} as Record<string, typeof Clothing>;

    static registerProductType(type: string, classRef: ProductRegistry) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type: string, payload: any) {
        //Type = Clothing => productClass: Clothing class
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) {
            throw new Error("Invalid product type" + type);
        }
        return new productClass(payload).create();
    }

    static async getAllProduct(
        limit = 50,
        page = 1,
        sort = "ctime",
        filter = { is_draft: true }
    ) {
        const products = await getAllProduct(limit, sort, page, filter, [
            "product_name",
            "product_price",
            "product_thumb",
        ]);

        return products;
    }

    static async updateProduct(type: string, product_id: string, payload: any) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new Error(`Product ${type} not found`);
        return new productClass(payload).update(product_id);
    }

    static async publishProductByShop(
        product_id: string,
        product_shop: number
    ) {
        return await publishProductByShop(product_id, product_shop);
    }

    static async unPublishProductByShop(
        product_id: string,
        product_shop: number
    ) {
        return await unPublishProductByShop(product_id, product_shop);
    }

    static async getAllPublishProductsForShop(
        product_shop: number,
        limit: number,
        page: number
    ): Promise<any> {
        const query = {
            product_shop: product_shop,
            is_published: true,
        };
        const data = await queryProduct(query, limit, page);
        console.log("data", data);
        return { data: data };
    }
}

ProductFactory.registerProductType("Clothing", Clothing);
