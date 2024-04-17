import express, { Request, Response } from "express";
import { clientProduct } from "../../start_server_grpc";
import { auth } from "../../auths/authUtil";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
    console.log(req.body);
    clientProduct.CreateProduct(req.body, (err: any, data: any) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json(data);
    });
});

export default router;
