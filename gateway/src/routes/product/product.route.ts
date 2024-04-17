import express, { Request, Response } from "express";
import { clientProduct } from "../../client";
import { auth } from "../../auths/authUtil";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
    console.log(req.body);
    clientProduct.CreateProduct(req.body, (err: any, data: any) => {
        if (err) return res.status(500).send(err);
        // console.log(data);
        return res.status(200).json(data);
    });
});

export default router;
