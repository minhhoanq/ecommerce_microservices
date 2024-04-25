import express from "express";
import { clientNotification } from "../../start_server_grpc";
const router = express.Router();

router.get("/", (req, res) => {
    clientNotification.TestConnection(null, (err: any, data: any) => {
        console.log("cehck1");
        if (err) return res.status(500).send(err);
        return res.status(200).json(data);
    });
});

export default router;
