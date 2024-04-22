import { Types } from "mongoose";
import { getSelectData } from "../../utils/helper.mongodb";
import { product } from "../schemas/product.schema";

export const getAllProduct = async (
    limit: number,
    sort: string,
    page: number,
    filter: any,
    select: string[]
) => {
    const skip = (page - 1) * limit;
    const sortBy: {} = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = await product
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();
    console.log(products);
    return products;
};

export const updateProductById = async (
    product_id: string,
    payload: any,
    schema: any,
    isNew = true
) => {
    return await schema.findByIdAndUpdate(product_id, payload, { new: isNew });
};

export const publishProductByShop = async (
    product_id: string,
    product_shop: number
) => {
    const foundShop = await product.findOne({
        product_shop: product_shop,
        _id: new Types.ObjectId(product_id),
    });

    if (!foundShop) throw new Error("Product is not exists!");

    foundShop.is_draft = false;
    foundShop.is_published = true;

    const { modifiedCount } = await foundShop.updateOne(foundShop);
    console.log("modifiedCount", modifiedCount);

    return { result: modifiedCount };
};

export const unPublishProductByShop = async (
    product_id: string,
    product_shop: number
) => {
    const foundShop = await product.findOne({
        product_shop: product_shop,
        _id: new Types.ObjectId(product_id),
    });
    if (!foundShop) throw new Error("Product is not exists!");
    foundShop.is_draft = true;
    foundShop.is_published = false;
    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return { result: modifiedCount };
};
