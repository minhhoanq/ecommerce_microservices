import express, { Request, Response } from "express";
import { clientProduct, clientUser } from "../../start_server_grpc";
import { GrantAccess } from "../../midlewares/rbac";
import { auth } from "../../auths/authUtil";

const router = express.Router();

router.post("/role", (req: Request, res: Response) => {
    const payload = req.body;
    clientUser.CreateRole(payload, (err: any, data: any) => {
        if (err) return res.status(err);
        return res.status(200).json(data);
    });
});

router.post("/resource", (req: Request, res: Response) => {
    const payload = req.body;
    clientUser.CreateResource(payload, (err: any, data: any) => {
        if (err) return res.status(err);
        return res.status(200).json(data);
    });
});

router.post("/role_resource", (req, res) => {
    const payload = req.body;
    console.log(payload);
    clientUser.CreateRoleResource(payload, (err: any, data: any) => {
        if (err) return res.status(err);
        return res.status(200).json(data);
    });
});

router.post("/access", (req, res) => {
    const payload = req.body;
    clientUser.GetAccess(payload, (err: any, data: any) => {
        console.log("cehceihiaw", data);
        if (err) return res.status(err);
        return res.status(200).json(data);
    });
});

//admin - product
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJyb2xlX2lkIjoxLCJlbWFpbCI6ImhvYW5nQGdtYWlsLmNvbSIsImlhdCI6MTcxMzY2ODE0MywiZXhwIjoxNzEzODQwOTQzfQ.sIitQbq_Wy0Pm_vDyNGTLrmRN9fquOi-QlPCtgxhgmU
router.patch(
    "/products/:productId",
    new auth().authentication,
    GrantAccess("updateAny", "product"),
    (req: Request, res: Response) => {
        // console.log(req.user.user_id);
        const payload = {
            product_id: req.params.productId,
            product_name: req.body.product_name || undefined,
            product_desc: req.body.product_desc || undefined,
            product_price: req.body.product_price || undefined,
            product_type: req.body.product_type,
            product_thumb: req.body.product_thumb || undefined,
            product_quantity: req.body.product_quantity || undefined,
            product_attributes: req.body.product_attributes || undefined,
            product_shop: req.body.product_shop,
        };
        console.log("payload ", payload);
        clientProduct.UpdateProduct(payload, (err: any, data: any) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(data);
        });
    }
);

export default router;
