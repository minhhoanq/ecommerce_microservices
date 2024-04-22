import { IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";

export class GetAllProduct {
    @IsNumber()
    limit: number;

    @IsNumber()
    page: number;
}

export class UpdateProduct {
    @IsString()
    product_name?: string;

    // // @IsString()
    // product_desc?: string;

    // // @IsNumber()
    // product_price?: number;

    // // @IsString()
    // product_thumb?: string;

    // // @IsNumber()
    // product_quantity?: number;

    // // @IsObject()
    // product_attributes?: any;
}

export class PubLishProductByShop {
    @IsNotEmpty()
    @IsString()
    product_id: string;

    @IsNotEmpty()
    @IsNumber()
    product_shop: number;
}

export class UnPubLishProductByShop {
    @IsNotEmpty()
    @IsString()
    product_id: string;

    @IsNotEmpty()
    @IsNumber()
    product_shop: number;
}
