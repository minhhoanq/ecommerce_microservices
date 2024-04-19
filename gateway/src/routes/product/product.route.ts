import express, { Request, Response } from "express";
import { clientProduct } from "../../start_server_grpc";
import { auth } from "../../auths/authUtil";

const router = express.Router();

router.post("/", new auth().authentication, (req: Request, res: Response) => {
    // console.log(req.user.user_id);
    const payload = {
        ...req.body,
        product_shop: req.user.user_id,
    };
    // console.log("payload ", payload);
    clientProduct.CreateProduct(payload, (err: any, data: any) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json(data);
    });
});

export default router;
