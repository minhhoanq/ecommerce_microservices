import express, { Request, Response } from "express";

import { product } from "../database/schemas/product.schema";
import { ProductFactory } from "../services/product.service";

const router = express.Router();

router.get("/", async (req, res) => {
    return res.json(
        await product.findById({
            _id: "661f9b97afa1fdebc0af14e1",
        })
    );
});

router.post("/product", async (req: Request, res: Response) => {
    return res.status(200).json(
        await ProductFactory.createProduct(req.body.product_type, {
            ...req.body,
            product_shop: 1,
        })
    );
});

export default router;
