import { IsNumber, IsObject, IsString } from "class-validator";

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
