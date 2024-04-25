import express, { NextFunction, Request, Response } from "express";
import { clientProduct } from "../../start_server_grpc";
import { auth } from "../../auths/authUtil";
import { GrantAccess } from "../../midlewares/rbac";
import { asyncHandler } from "../../helpers/asyncHandler";
import { publishMessage, setupChannel } from "../../utils/rabbitmq";

// const startChannelRbMQ = async () => {
//     const channelSetup = await setupChannel();
//     return channelSetup;
// };

const router = express.Router();

router.post(
    "/",
    new auth().authentication,
    GrantAccess("createOwn", "product"),
    (req: Request, res: Response) => {
        // console.log(req.user.user_id);
        const payload = {
            ...req.body,
            product_shop: req.user.shop_id,
        };
        // console.log("payload ", payload);
        clientProduct.CreateProduct(payload, (err: any, data: any) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(data);
        });
    }
);

router.get(
    "/",
    new auth().authentication,
    GrantAccess("readAny", "product"),
    (req: Request, res: Response) => {
        const payload = {
            limit: req.query.limit,
            page: req.query.page,
        };
        console.log(payload);
        clientProduct.GetAllProduct(payload, (err: any, data: any) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(data);
        });
    }
);

router.patch(
    "/:productId",
    new auth().authentication,
    GrantAccess("updateOwn", "product"),
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
            product_shop: req.user.shop_id,
        };
        console.log("payload ", payload);
        clientProduct.UpdateProduct(payload, (err: any, data: any) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(data);
        });
    }
);

router.patch(
    "/publish/:productId",
    new auth().authentication,
    GrantAccess("updateOwn", "product"),
    (req: Request, res: Response, next: NextFunction) => {
        const payload = {
            product_id: req.params.productId,
            product_shop: req.user.shop_id,
        };
        console.log("shop_id", req.user);
        console.log("payload ", payload);
        clientProduct.PublishProductByShop(
            payload,
            async (err: any, data: any) => {
                if (err) return res.status(500).send(err);
                const payloadNoti: any = {
                    event: "CREATE_NOTIFICATION",
                    data: {
                        type: "CREATE_PRODUCT",
                        senderId: data.product_shop,
                        content: data.product_name,
                    },
                };
                console.log("payloadNoti: ", payloadNoti);
                const channel = await setupChannel();

                publishMessage(channel, "NOTI_KEY", payloadNoti);
                return res.status(200).json(data);
            }
        );
    }
);

router.patch(
    "/unpublish/:productId",
    new auth().authentication,
    GrantAccess("updateOwn", "product"),
    (req: Request, res: Response) => {
        const payload = {
            product_id: req.params.productId,
            product_shop: req.user.shop_id,
        };
        console.log("payload ", payload);
        clientProduct.UnPublishProductByShop(payload, (err: any, data: any) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(data);
        });
    }
);

router.get(
    "/published/all",
    new auth().authentication,
    GrantAccess("readOwn", "product"),
    (req: Request, res: Response) => {
        const payload = {
            product_shop: req.user.shop_id,
            limit: req.query.limit,
            page: req.query.page,
        };
        console.log(payload);
        clientProduct.GetAllPublishProductsForShop(
            payload,
            (err: any, data: any) => {
                if (err) return res.status(500).send(err);
                return res.status(200).json(data);
            }
        );
    }
);

export default router;
