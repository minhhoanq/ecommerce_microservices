import {
    GetAllProduct,
    PubLishProductByShop,
    UnPubLishProductByShop,
    UpdateProduct,
} from "../dto/product.dto";
import { ProductFactory } from "../services/product.service";
import { RequestValidator } from "../utils/request.validator";
import { status, sendUnaryData } from "@grpc/grpc-js";

export class ProductHandlerFatory {
    public static productHandlers(): any {
        const handler = {
            CreateProduct: async (call: any, callback: any) => {
                // console.log("check payload: ", call.request);
                const { product_shop, ...payload } = call.request;
                // console.log("prouduct_shop ", product_shop);
                const product = await ProductFactory.createProduct(
                    payload.product_type,
                    {
                        ...payload,
                        product_shop: product_shop,
                    }
                );
                callback(null, product);
            },

            GetAllProduct: async (call: any, callback: any) => {
                try {
                    const payload = call.request;
                    const { errors, input } = await RequestValidator(
                        GetAllProduct,
                        payload
                    );
                    //if errors
                    if (errors) {
                        callback(
                            {
                                code: status.INVALID_ARGUMENT,
                                message: "Invalid input data",
                                details: errors,
                            },
                            null
                        );
                        return;
                    }
                    // if not errors
                    const products = await ProductFactory.getAllProduct(
                        Number(payload.limit),
                        Number(payload.page)
                    );

                    callback(null, { products: products });
                } catch (error) {
                    this.handlerError(error, callback);
                }
            },

            //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3LCJyb2xlX2lkIjoyLCJlbWFpbCI6ImhvYW5nU2hvcEBnbWFpbC5jb20iLCJpYXQiOjE3MTM2ODY0MzUsImV4cCI6MTcxMzg1OTIzNX0.iIhbkaa5ksht9gkM-Oeail6n_p0ttkSTi2SozWDmOIw
            UpdateProduct: async (call: any, callback: any) => {
                try {
                    const { product_type, product_id, ...data } = call.request;
                    if (
                        product_type === undefined ||
                        product_id === undefined
                    ) {
                        callback(
                            {
                                code: status.INVALID_ARGUMENT,
                                message: "Invalid input data",
                            },
                            null
                        );
                        return;
                    }

                    // const { errors, input } = await RequestValidator(
                    //     UpdateProduct,
                    //     data
                    // );

                    // if (errors) {
                    //     callback(
                    //         {
                    //             code: status.INVALID_ARGUMENT,
                    //             message: "Invalid input data",
                    //             details: errors,
                    //         },
                    //         null
                    //     );
                    //     return;
                    // }

                    const updateProduct = await ProductFactory.updateProduct(
                        product_type,
                        product_id,
                        data
                    );
                    callback(null, updateProduct);
                } catch (error) {
                    this.handlerError(error, callback);
                }
            },

            PublishProductByShop: async (call: any, callback: any) => {
                try {
                    const payload = call.request;
                    console.log(payload);
                    const { errors, input } = await RequestValidator(
                        PubLishProductByShop,
                        payload
                    );
                    if (errors) {
                        callback({
                            code: status.INVALID_ARGUMENT,
                            message: "Invalid input data",
                            details: errors,
                        });
                    }
                    const publishProductByShop =
                        await ProductFactory.publishProductByShop(
                            input.product_id,
                            Number(input.product_shop)
                        );
                    console.log(publishProductByShop);
                    callback(null, publishProductByShop);
                } catch (error) {
                    this.handlerError(error, callback);
                }
            },

            UnPublishProductByShop: async (call: any, callback: any) => {
                try {
                    const payload = call.request;
                    console.log(payload);
                    const { errors, input } = await RequestValidator(
                        UnPubLishProductByShop,
                        payload
                    );
                    if (errors) {
                        callback({
                            code: status.INVALID_ARGUMENT,
                            message: "Invalid input data",
                            details: errors,
                        });
                    }
                    const unPublishProductByShop =
                        await ProductFactory.unPublishProductByShop(
                            input.product_id,
                            input.product_shop
                        );
                    console.log(unPublishProductByShop);
                    callback(null, unPublishProductByShop);
                } catch (error) {
                    this.handlerError(error, callback);
                }
            },
            GetAllPublishProductsForShop: async (
                call: any,
                callback: any
            ): Promise<any> => {
                try {
                    const payload = call.request;
                    const getAllPublishProductsByShop =
                        await ProductFactory.getAllPublishProductsForShop(
                            payload.product_shop,
                            payload.limit,
                            payload.page
                        );

                    callback(null, getAllPublishProductsByShop);
                } catch (error) {
                    this.handlerError(error, callback);
                }
            },
        };

        return handler;
    }
    private static handlerError(error: unknown, callback: sendUnaryData<any>) {
        if (error instanceof Error) {
            callback({ message: error.message, code: status.INTERNAL });
        }
    }
}
